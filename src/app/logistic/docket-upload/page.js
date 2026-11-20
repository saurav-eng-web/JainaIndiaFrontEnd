"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import ImageUpload from "@/components/customui/image/ImageUpload";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import UploadProgress from "@/components/customui/UploadProgress";
import { exportToExcel } from "@/utils/exportToExcel";

const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

const EXPECTED_HEADERS = ["CourierCode", "DocketNo"];

export default function DocketUploadPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingGrids, setIsLoadingGrids] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState({ title: "", items: [] });

  function handleSampleDownload() {
    try {
      exportToExcel({
        data: [EXPECTED_HEADERS.reduce((row, header) => ({ ...row, [header]: "" }), {})],
        headers: EXPECTED_HEADERS.map((header) => ({ label: header, key: header })),
        fileName: "Logistic-DocketUpload-Template.xlsx",
        sheetName: "DocketUpload",
      });
      toast.success("Sample template downloaded");
    } catch (error) {
      console.error("Error building sample template:", error);
      toast.error("Failed to download sample");
    }
  }

  // ImageUpload calls onChange with the change EVENT (not the File), so read the file from the event.
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
  }

  function parseExcelAndValidate(file) {
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

          // Legacy bulk copy mapped the columns BY NAME, so the column order does not matter (extra columns are ignored)
          const lowerHeaders = headers.map((h) => h.toLowerCase());
          const problems = [];
          EXPECTED_HEADERS.forEach((expected) => {
            if (!lowerHeaders.includes(expected.toLowerCase())) {
              problems.push(`Column "${expected}" is missing`);
            }
          });

          if (problems.length > 0) {
            reject({
              title: "Excel columns do not match the expected format",
              items: problems,
            });
            return;
          }

          // Accept the headers in any case / order: rename them to the canonical names
          const canon = Object.fromEntries(EXPECTED_HEADERS.map((h) => [h.toLowerCase(), h]));
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }).map((r) =>
            Object.fromEntries(Object.entries(r).map(([k, v]) => [canon[k.trim().toLowerCase()] || k, v]))
          );
          const rows = jsonData.map((row) => ({
            CourierCode: String(row["CourierCode"] || "").trim(),
            DocketNo: String(row["DocketNo"] || "").trim(),
          })).filter(row => row.CourierCode || row.DocketNo);

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

      reader.onerror = () => {
        reject({ title: "Error reading file.", items: [] });
      };

      reader.readAsBinaryString(file);
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

      const res = await axiosInstance.post("logistic/dockets/upload", parsedRows, {
        onUploadProgress: (event) => {
          const p = Math.round((event.loaded * 100) / event.total);
          setProgress(40 + (p * 0.6)); 
        },
      });

      toast.success(res.data?.message || "File uploaded successfully!");
      setFile(null);
      setFileName("");
      
    } catch (error) {
      if (error?.title) {
        setUploadErrors({ title: error.title, items: error.items || [] });
        toast.error(error.title);
        return;
      }
      const msg = error?.response?.data?.message || "Failed to upload file";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  async function fetchDownloads() {
    try {
      setIsLoadingGrids(true);
      const res = await axiosInstance.get("logistic/dockets/downloads");
      downloadList(res.data, "Docket", [
        { key: "courierCode", label: "Courier Code" },
        { key: "courier", label: "Courier" },
        { key: "docketNo", label: "Docket No" },
        { key: "isUsed", label: "Is Used" },
        { key: "inventoryType", label: "Inventory Type" },
        { key: "date", label: "Date" },
      ]);
    } catch (error) {
      toast.error("Failed to load docket downloads");
    } finally {
      setIsLoadingGrids(false);
    }
  }

  async function fetchNotUploaded() {
    try {
      setIsLoadingGrids(true);
      const res = await axiosInstance.get("logistic/dockets/not-uploaded");
      downloadList(res.data, "Docket Not Uploaded", [
        { key: "courierCode", label: "Courier Code" },
        { key: "docketNo", label: "Docket No" },
        { key: "isUpload", label: "Is Upload" },
        { key: "date", label: "Date" },
      ]);
    } catch (error) {
      toast.error("Failed to load not uploaded dockets");
    } finally {
      setIsLoadingGrids(false);
    }
  }

  // Like the legacy buttons: the list is downloaded straight away as an Excel file (no grid on the page).
  function downloadList(rows, fileName, columns) {
    if (!rows || rows.length === 0) {
      toast.error(`No data found for ${fileName}`);
      return;
    }
    try {
      exportToExcel({
        data: rows,
        headers: columns.map((c) => ({ label: c.label, key: c.key })),
        fileName: `${fileName}.xlsx`,
        sheetName: "Sheet1",
      });
      toast.success(`${fileName} downloaded`);
    } catch (error) {
      toast.error("Download failed");
    }
  }

  return (
    <PageSkeleton title="Docket Upload" rolesAllowed={["logistic"]} backHref="/logistic/uploaders">
      <Subheading title="Upload Blank Dockets" />

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
        </div>
      )}

      <div className="mt-10">
        <Subheading title="Docket History & Reports" />
        <div className="flex gap-4 mt-4">
           <Button variant="outline" onClick={fetchDownloads} disabled={isLoadingGrids}>
             {isLoadingGrids ? "Downloading..." : "Docket Download"}
           </Button>
           <Button variant="outline" onClick={fetchNotUploaded} disabled={isLoadingGrids}>
             Docket Not Uploaded
           </Button>
        </div>
      </div>

    </PageSkeleton>
  );
}
