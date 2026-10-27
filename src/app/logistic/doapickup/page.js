/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Added backHref="/logistic/dashboard" for Logistic Module navigation
 * -----------------------------------------------------------------------------
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdEventAvailable, MdHourglassEmpty, MdLocalShipping } from "react-icons/md";
import * as XLSX from "xlsx";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import ImageUpload from "@/components/customui/image/ImageUpload";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import UploadProgress from "@/components/customui/UploadProgress";
import { exportToExcel } from "@/utils/exportToExcel";
import {
  buildPickupExport,
  emptyPickupTotals,
  mapDistributorCounts,
  mapStatusTotals,
  PICKUP_STATUS_BUCKETS,
} from "@/utils/pickupUtils";

const UPLOAD_ENDPOINT = "LogisticUpload/upload";

const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

// The API reads columns by POSITION, so order here is what actually matters
const EXPECTED_HEADERS = [
  "TicketNumber",
  "SerialNumber",
  "CourierName",
  "DocketNo",
  "docStatus",
  "StatusDate",
];

function normaliseHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");
}

const BUCKET_STYLES = {
  pickupawaited: {
    Icon: MdHourglassEmpty,
    accent: "border-amber-400",
    iconWrap: "bg-amber-100 text-amber-700",
    value: "text-amber-700",
    ring: "ring-amber-400",
    bar: "bg-amber-400",
    pill: "bg-amber-100 text-amber-700",
  },
  intransit: {
    Icon: MdLocalShipping,
    accent: "border-blue-400",
    iconWrap: "bg-blue-100 text-blue-700",
    value: "text-blue-700",
    ring: "ring-blue-400",
    bar: "bg-blue-400",
    pill: "bg-blue-100 text-blue-700",
  },
  scheduled: {
    Icon: MdEventAvailable,
    accent: "border-violet-400",
    iconWrap: "bg-violet-100 text-violet-700",
    value: "text-violet-700",
    ring: "ring-violet-400",
    bar: "bg-violet-400",
    pill: "bg-violet-100 text-violet-700",
  },
};

const EMPTY_PILL = "bg-gray-100 text-gray-400";

function CountPill({ value, tone, emphasised }) {
  return (
    <span
      className={`inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
        value ? tone : EMPTY_PILL
      } ${emphasised ? "scale-110 shadow-sm" : ""}`}
    >
      {value ?? 0}
    </span>
  );
}

// Eases a number up from zero so the cards animate on load and on refresh
function useCountUp(target, duration = 700) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof target !== "number" || Number.isNaN(target)) {
      setDisplay(0);
      return undefined;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return display;
}

function AnimatedCount({ value, className }) {
  const display = useCountUp(value);
  return <span className={className}>{display}</span>;
}

// Confirms the workbook is readable, has data rows, and its header row matches
// EXPECTED_HEADERS exactly in order - the API maps by position, so a reordered
// sheet would silently load data into the wrong columns.
function validateWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!sheet || !sheet["!ref"]) {
          reject({ title: "The selected file has no readable sheet.", items: [] });
          return;
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        if (range.e.r - range.s.r === 0) {
          reject({ title: "No data rows found in the Excel file.", items: [] });
          return;
        }

        const headers = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = sheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })];
          headers.push(cell ? String(cell.v).trim() : "");
        }

        while (headers.length > 0 && !headers[headers.length - 1]) headers.pop();

        const problems = [];

        EXPECTED_HEADERS.forEach((expected, index) => {
          const actual = headers[index] || "";

          if (normaliseHeader(actual) !== normaliseHeader(expected)) {
            problems.push(
              actual
                ? `Column ${index + 1} must be "${expected}" but found "${actual}"`
                : `Column ${index + 1} "${expected}" is missing`
            );
          }
        });

        const extras = headers.slice(EXPECTED_HEADERS.length).filter(Boolean);
        if (extras.length > 0) {
          problems.push(`Unexpected extra column(s): ${extras.join(", ")}`);
        }

        if (problems.length > 0) {
          reject({ title: "Column mismatch - file not uploaded", items: problems });
          return;
        }

        resolve(true);
      } catch (err) {
        reject({ title: `Error reading file: ${err.message}`, items: [] });
      }
    };

    reader.onerror = () => reject({ title: "Failed to read the file.", items: [] });
    reader.readAsBinaryString(file);
  });
}

export default function LogisticPickupPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState({ title: "", items: [] });
  const [totals, setTotals] = useState(emptyPickupTotals);
  const [breakdown, setBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeBucket, setActiveBucket] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Drives the staggered entrance of the status cards
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Cards come from the per-status counts; the table from the per-distributor pivot
  const fetchCounts = useCallback(async () => {
    try {
      setIsLoading(true);

      const [statusRes, distributorRes] = await Promise.all([
        axiosInstance.post("TDDOAPickup/process", { action: "distwisecount1" }),
        axiosInstance.post("TDDOAPickup/process", { action: "distwisecount" }),
      ]);

      const statusRows = statusRes.data?.data || statusRes.data?.Data || [];
      const distributorRows =
        distributorRes.data?.data || distributorRes.data?.Data || [];

      setTotals(mapStatusTotals(statusRows));
      setBreakdown(mapDistributorCounts(distributorRows));
    } catch (error) {
      console.error("Error fetching pickup counts:", error);
      toast.error("Failed to load pickup counts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Clicking a bucket card narrows the breakdown to distributors holding that status
  const visibleBreakdown = useMemo(() => {
    if (!activeBucket) return breakdown;
    return breakdown.filter((row) => row[activeBucket] > 0);
  }, [breakdown, activeBucket]);

  // Counts render as pills tinted to their bucket; the active bucket pops
  const breakdownColumns = useMemo(
    () => [
      {
        label: "S.No",
        key: "sno",
        size: "xxs",
        render: (_data, _row, rowIndex) => rowIndex + 1,
      },
      { label: "Created By", key: "createdBy", size: "xxl" },
      ...PICKUP_STATUS_BUCKETS.map((bucket) => ({
        label: bucket.label,
        key: bucket.key,
        size: "sm",
        render: (value) => (
          <CountPill
            value={value}
            tone={BUCKET_STYLES[bucket.key].pill}
            emphasised={activeBucket === bucket.key}
          />
        ),
      })),
      {
        label: "Total",
        key: "total",
        size: "sm",
        render: (value) => (
          <CountPill value={value} tone="bg-[#714b67]/10 text-[#714b67]" />
        ),
      },
    ],
    [activeBucket]
  );

  function toggleBucket(key) {
    setActiveBucket((prev) => (prev === key ? null : key));
  }

  // Exports every column LOGSELECT returns, not just the ones shown here
  async function handleExcelDownload() {
    try {
      setIsExporting(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "LOGSELECT",
      });

      const body = res.data || {};
      const rows = body.data || body.Data || [];

      if (rows.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const { headers, data } = buildPickupExport(rows);

      exportToExcel({
        data,
        headers,
        fileName: `TD-DOA-CN-Pickup-${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: "Pickup Status",
      });

      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Error exporting pickup requests:", error);
      toast.error("Failed to export Excel");
    } finally {
      setIsExporting(false);
    }
  }

  // Template is built from EXPECTED_HEADERS so it can never drift from the validator
  function handleSampleDownload() {
    try {
      exportToExcel({
        data: [EXPECTED_HEADERS.reduce((row, header) => ({ ...row, [header]: "" }), {})],
        headers: EXPECTED_HEADERS.map((header) => ({ label: header, key: header })),
        fileName: "Logistic-Dispatch-Template.xlsx",
        sheetName: "Dispatch",
      });

      toast.success("Sample template downloaded");
    } catch (error) {
      console.error("Error building sample template:", error);
      toast.error("Failed to download sample");
    }
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast.error("Only Excel (.xlsx or .xls) files are supported");
      setFile(null);
      setFileName("");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setProgress(0);
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      setUploadErrors({ title: "", items: [] });

      await validateWorkbook(file);

      const formData = new FormData();
      formData.append("file", file);

      // No Content-Type here on purpose - the browser must set the multipart boundary
      const res = await axiosInstance.post(UPLOAD_ENDPOINT, formData, {
        onUploadProgress: (event) =>
          setProgress(Math.round((event.loaded * 100) / event.total)),
        timeout: 300000,
      });

      const body = res.data || {};

      if (body.statusCode !== 200) {
        setUploadErrors({
          title: body.statusMsg || "Failed to upload file",
          items: (body.data || []).map((item) => `Row ${item.row}: ${item.error}`),
        });
        toast.error(body.statusMsg || "Failed to upload file");
        return;
      }

      toast.success(`${body.count} row(s) uploaded successfully`);

      setFile(null);
      setFileName("");

      // Promote the staged LogisticUpload rows into the pickup table
      const promoteRes = await axiosInstance.post("TDDOAPickup/process", {
        action: "LOGISTICUPLOAD",
      });

      if (promoteRes.data?.statusCode !== 200) {
        toast.error(
          promoteRes.data?.statusMsg ||
            "Rows uploaded but not processed. Please retry the upload."
        );
      }

      await fetchCounts();
    } catch (error) {
      // Client-side validation rejects with { title, items }
      if (error?.title) {
        setUploadErrors({ title: error.title, items: error.items || [] });
        toast.error(error.title);
        return;
      }

      const body = error?.response?.data;

      // Per-row validation failures come back as data: [{ row, error }]
      if (Array.isArray(body?.data) && body.data.length > 0) {
        setUploadErrors({
          title: body.statusMsg || "Excel contains invalid data",
          items: body.data.map((item) => `Row ${item.row}: ${item.error}`),
        });
        toast.error(body.statusMsg || "Excel contains invalid data");
        return;
      }

      console.error("Error uploading file:", error);
      toast.error(body?.statusMsg || body?.errors?.file?.[0] || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    // Modified by Saurav Date: 26-Oct-2026 for Logistic Module (Added backHref)
    <PageSkeleton title="TD / DOA / CN Pickup Dispatch" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      {/* UPLOAD */}
      <Subheading title="Upload dispatch file" />

      <div className="flex flex-wrap items-start gap-6">
        <div className="w-xs">
          <ImageUpload
            label="Excel File"
            accept=".xlsx,.xls"
            variant="input"
            onChange={handleFileSelect}
            disabled={isUploading}
            message={fileName ? `Selected: ${fileName}` : ""}
            required
          />

          <p className="mt-1 text-xs text-gray-500">
            Columns in order: {EXPECTED_HEADERS.join(", ")}
          </p>
        </div>

        <Button className="mt-6" onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Upload file"}
        </Button>

        <Button
          className="mt-6"
          variant="outline"
          onClick={handleSampleDownload}
          disabled={isUploading}
        >
          Download Sample
        </Button>
      </div>

      {isUploading && (
        <div className="mt-6 max-w-xl">
          <UploadProgress progress={progress} />
        </div>
      )}

      {uploadErrors.title && (
        <div className="mt-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-red-700">{uploadErrors.title}</p>

            <button
              type="button"
              onClick={() => setUploadErrors({ title: "", items: [] })}
              className="cursor-pointer text-xs font-semibold text-red-700 hover:underline"
            >
              Dismiss
            </button>
          </div>

          {uploadErrors.items.length > 0 && (
            <ul className="mt-3 max-h-48 list-inside list-disc space-y-1 overflow-y-auto text-sm text-red-700">
              {uploadErrors.items.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-xs text-red-600">
            Nothing was uploaded. Fix the file and try again.
          </p>
        </div>
      )}

      {/* STATUS BUCKETS */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PICKUP_STATUS_BUCKETS.map((bucket, index) => {
          const style = BUCKET_STYLES[bucket.key];
          const Icon = style.Icon;
          const isActive = activeBucket === bucket.key;
          const count = totals[bucket.key];
          const share = totals.total ? Math.round((count / totals.total) * 100) : 0;

          return (
            <button
              key={bucket.key}
              type="button"
              onClick={() => toggleBucket(bucket.key)}
              style={{ transitionDelay: `${index * 90}ms` }}
              className={`group flex cursor-pointer flex-col rounded-xl border-l-4 bg-white p-5 text-left shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${style.accent} ${
                isActive ? `shadow-lg ring-2 ${style.ring}` : ""
              } ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <div className="flex w-full items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{bucket.label}</p>

                  {isLoading ? (
                    <span
                      className={`mt-1 block text-3xl font-bold ${style.value} animate-pulse`}
                    >
                      &middot;&middot;&middot;
                    </span>
                  ) : (
                    <AnimatedCount
                      value={count}
                      className={`mt-1 block text-3xl font-bold ${style.value}`}
                    />
                  )}
                </div>

                <div
                  className={`rounded-full p-3 transition-transform duration-300 group-hover:scale-110 ${style.iconWrap}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>

              {/* share of total */}
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{share}% of all requests</span>
                  <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {isActive ? "Click to clear" : "Click to filter"}
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${style.bar}`}
                    style={{ width: `${isLoading ? 0 : share}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* PER-DISTRIBUTOR BREAKDOWN */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <Subheading title="Distributor Breakdown" />

          <div className="flex items-center gap-4">
            <span
              className={`text-xs font-medium text-gray-500 transition-opacity duration-300 ${
                activeBucket ? "opacity-100" : "opacity-0"
              }`}
            >
              Showing {visibleBreakdown.length} of {breakdown.length}
            </span>

            {activeBucket && (
              <button
                type="button"
                onClick={() => setActiveBucket(null)}
                className="cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white"
              >
                Clear filter
              </button>
            )}

            <Button
              variant="outline"
              onClick={handleExcelDownload}
              disabled={isLoading || isExporting}
            >
              {isExporting ? "Preparing..." : "Export to Excel"}
            </Button>
          </div>
        </div>

        <div className="transition-opacity duration-300">
          <Table
            columns={breakdownColumns}
            rows={visibleBreakdown}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageSkeleton>
  );
}
