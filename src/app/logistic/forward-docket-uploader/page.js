"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 20-Nov-2026  Saurav   Created for Logistic Module: Forward Logistic Docket Uploader.
 *                       Excel columns: ChallanNo, DocketNo, DOCStatus (In-Transit / Delivered), TransDate,
 *                       UploadType, ChallanType. A future TransDate is not allowed (popup error).
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import ImageUpload from "@/components/customui/image/ImageUpload";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import UploadProgress from "@/components/customui/UploadProgress";
import { exportToExcel } from "@/utils/exportToExcel";

const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const EXPECTED_HEADERS = ["ChallanNo", "DocketNo", "DOCStatus", "TransDate", "UploadType", "ChallanType"];

const FUTURE_DATE_MESSAGE = "Future Date Not Allowed Under Transaction Date Please Modify you Excel Sheet";

const MAX_LISTED_ROWS = 10;

const pad = (n) => String(n).padStart(2, "0");

function normalizeDocStatus(value) {
  const text = String(value ?? "").trim();
  if (/^in[\s-]?transit$/i.test(text)) return "In-Transit";
  if (/^delivered$/i.test(text)) return "Delivered";
  return null;
}

function isRealDate({ y, m, d }) {
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function parseTransDate(value) {
  if (value === null || value === undefined || value === "") return null;

  let parts = null;

  if (typeof value === "number") {
    const code = XLSX.SSF.parse_date_code(value);
    if (code) parts = { y: code.y, m: code.m, d: code.d, H: code.H || 0, M: code.M || 0, S: Math.floor(code.S || 0) };
  } else {
    const text = String(value).trim();

    if (/^\d+(\.\d+)?$/.test(text)) {
      return parseTransDate(Number(text)); // a serial number typed as text
    }

    let m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(text);
    if (m) {
      parts = { y: +m[1], m: +m[2], d: +m[3], H: +(m[4] || 0), M: +(m[5] || 0), S: +(m[6] || 0) };
    } else {
      m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(text);
      if (m) parts = { y: +m[3], m: +m[2], d: +m[1], H: +(m[4] || 0), M: +(m[5] || 0), S: +(m[6] || 0) };
    }
  }

  if (!parts || !isRealDate(parts)) return null;
  return parts;
}

function isFutureDate({ y, m, d }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(y, m - 1, d) > today;
}

const toDisplay = ({ y, m, d }) => `${pad(d)}-${pad(m)}-${y}`;
const toIso = ({ y, m, d, H, M, S }) => `${y}-${pad(m)}-${pad(d)}T${pad(H)}:${pad(M)}:${pad(S)}`;

export default function ForwardDocketUploaderPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState({ title: "", items: [] });
  const [futureDateRows, setFutureDateRows] = useState([]); // rows that opened the popup

  function handleSampleDownload() {
    try {
      exportToExcel({
        data: [EXPECTED_HEADERS.reduce((row, header) => ({ ...row, [header]: "" }), {})],
        headers: EXPECTED_HEADERS.map((header) => ({ label: header, key: header })),
        fileName: "Logistic-ForwardUploader-Template.xlsx",
        sheetName: "DocketChange",
      });
      toast.success("Sample template downloaded");
    } catch (error) {
      console.error("Error building sample template:", error);
      toast.error("Failed to download sample");
    }
  }

  function handleFileSelect(event) {
    const selectedFile = event?.target?.files?.[0] ?? (event instanceof File ? event : null);
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
    setUploadErrors({ title: "", items: [] });
  }

  function parseExcelAndValidate(selectedFile) {
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

          const lowerHeaders = headers.map((h) => h.toLowerCase());
          const missing = EXPECTED_HEADERS.filter((expected) => !lowerHeaders.includes(expected.toLowerCase()));
          if (missing.length > 0) {
            reject({
              title: "Excel columns do not match the expected format",
              items: missing.map((name) => `Column "${name}" is missing`),
            });
            return;
          }

          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
          const canon = Object.fromEntries(EXPECTED_HEADERS.map((h) => [h.toLowerCase(), h]));

          const rows = [];
          const problems = [];
          const futureRows = [];

          jsonData.forEach((raw) => {
            const row = {};
            Object.entries(raw).forEach(([key, value]) => {
              const name = canon[String(key).trim().toLowerCase()];
              if (name) row[name] = value;
            });

            const text = (name) => String(row[name] ?? "").trim();
            const isBlankRow = EXPECTED_HEADERS.every((name) => text(name) === "");
            if (isBlankRow) return;

            const excelRow = (raw.__rowNum__ ?? 0) + 1;

            if (!text("ChallanNo")) problems.push(`Row ${excelRow}: ChallanNo is required`);
            if (!text("DocketNo")) problems.push(`Row ${excelRow}: DocketNo is required`);

            const docStatus = normalizeDocStatus(row.DOCStatus);
            if (!docStatus) problems.push(`Row ${excelRow}: DOCStatus must be In-Transit or Delivered (found "${text("DOCStatus")}")`);

            const transDate = parseTransDate(row.TransDate);
            if (!transDate) {
              problems.push(`Row ${excelRow}: TransDate is missing or not a valid date`);
            } else if (isFutureDate(transDate)) {
              futureRows.push(`Row ${excelRow}: ${toDisplay(transDate)}`);
            }

            if (docStatus && transDate && text("ChallanNo") && text("DocketNo")) {
              rows.push({
                ChallanNo: text("ChallanNo"),
                DocketNo: text("DocketNo"),
                DocStatus: docStatus,
                TransDate: toIso(transDate),
                UploadType: text("UploadType") || "Forward",
                ChallanType: text("ChallanType") || "Forward",
              });
            }
          });

          if (futureRows.length > 0) {
            reject({ title: FUTURE_DATE_MESSAGE, items: futureRows, isFutureDate: true });
            return;
          }

          if (problems.length > 0) {
            reject({ title: "Excel data is not valid. Please correct these rows and upload again", items: problems });
            return;
          }

          if (rows.length === 0) {
            reject({ title: "No valid data rows found in the Excel file.", items: [] });
            return;
          }

          resolve(rows);
        } catch (err) {
          console.error("Excel parse error:", err);
          reject({ title: "Failed to parse Excel file.", items: [] });
        }
      };

      reader.onerror = () => reject({ title: "Error reading file.", items: [] });
      reader.readAsBinaryString(selectedFile);
    });
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(10);
      setUploadErrors({ title: "", items: [] });

      const parsedRows = await parseExcelAndValidate(file);
      setProgress(40);

      const res = await axiosInstance.post("logistic/dockets/process", { type: "uploadForward", data: parsedRows }, {
        onUploadProgress: (event) => {
          const p = Math.round((event.loaded * 100) / (event.total || 1));
          setProgress(40 + p * 0.6);
        },
      });

      toast.success(res.data?.statusMsg || "File uploaded successfully!");
      setFile(null);
      setFileName("");

      const notApplied = Array.isArray(res.data?.data) ? res.data.data : [];
      if (notApplied.length > 0) {
        setUploadErrors({
          title: `${notApplied.length} row(s) could not be applied:`,
          items: notApplied
            .slice(0, 50)
            .map((r) => `${r.challanNo} / ${r.docketNo} (${r.docStatus}) - ${r.reason}`),
        });
      }
    } catch (error) {
      if (error?.title) {
        setUploadErrors({ title: error.title, items: error.items || [] });
        if (error.isFutureDate) {
          setFutureDateRows(error.items || []);
        } else {
          toast.error(error.title);
        }
        return;
      }
      toast.error(error?.response?.data?.statusMsg || "Failed to upload file");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <PageSkeleton title="Forward Logistic Docket Uploader" rolesAllowed={["logistic"]} backHref="/logistic/uploaders">
      <Subheading title="Upload Forward Docket Sheet" />

      <div className="flex flex-wrap items-start gap-6">
        <div className="w-xs">
          <ImageUpload
            label="Excel File"
            accept=".xlsx,.xls"
            variant="input"
            onChange={handleFileSelect}
            disabled={isUploading}
            message={fileName ? <span className="inline-block max-w-[11rem] truncate align-bottom" title={fileName}>{`Selected: ${fileName}`}</span> : ""}
            required
          />

          <p className="mt-1 text-xs text-gray-500">Columns: {EXPECTED_HEADERS.join(", ")}</p>
          <p className="mt-1 text-xs text-gray-500">DOCStatus must be In-Transit or Delivered.</p>
          <p className="mt-1 text-xs text-gray-500">TransDate cannot be a future date.</p>
        </div>

        <Button className="mt-6" onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Upload file"}
        </Button>

        <Button className="mt-6" variant="outline" onClick={handleSampleDownload} disabled={isUploading}>
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
        </div>
      )}

      <Modal open={futureDateRows.length > 0} onClose={() => setFutureDateRows([])}>
        <div className="w-[min(92vw,30rem)] p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-7 w-7 shrink-0 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-700">Invalid Transaction Date</h3>
              <p className="mt-2 text-sm text-gray-800">{FUTURE_DATE_MESSAGE}</p>
            </div>
          </div>

          <ul className="mt-4 max-h-40 list-inside list-disc space-y-1 overflow-y-auto rounded-md bg-red-50 p-3 text-sm text-red-700">
            {futureDateRows.slice(0, MAX_LISTED_ROWS).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
            {futureDateRows.length > MAX_LISTED_ROWS && <li>...and {futureDateRows.length - MAX_LISTED_ROWS} more row(s)</li>}
          </ul>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => setFutureDateRows([])}>OK</Button>
          </div>
        </div>
      </Modal>
    </PageSkeleton>
  );
}
