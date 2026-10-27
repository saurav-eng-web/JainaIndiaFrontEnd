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
import Table from "@/components/common/Table";
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
  
  const [activeTab, setActiveTab] = useState(""); 
  const [gridData, setGridData] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);

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

  function handleFileSelect(selectedFile) {
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

          const problems = [];
          EXPECTED_HEADERS.forEach((expected, index) => {
            const actual = headers[index] || "";
            if (actual.toLowerCase() !== expected.toLowerCase()) {
              problems.push(`Column ${index + 1} should be "${expected}" but was "${actual}"`);
            }
          });

          if (problems.length > 0) {
            reject({
              title: "Excel columns do not match the expected format",
              items: problems,
            });
            return;
          }

          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
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
      
      // Auto refresh grids if one is open
      if (activeTab === "DOWNLOADS") fetchDownloads();
      if (activeTab === "NOT_UPLOADED") fetchNotUploaded();
      
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
      setActiveTab("DOWNLOADS");
      const res = await axiosInstance.get("logistic/dockets/downloads");
      const data = res.data || [];
      
      setGridColumns([
        { key: "courierCode", label: "Courier Code" },
        { key: "courier", label: "Courier" },
        { key: "docketNo", label: "Docket No" },
        { key: "isUsed", label: "Is Used" },
        { key: "inventoryType", label: "Inventory Type" },
        { key: "date", label: "Date" },
      ]);
      setGridData(data);
    } catch (error) {
      toast.error("Failed to load docket downloads");
    } finally {
      setIsLoadingGrids(false);
    }
  }

  async function fetchNotUploaded() {
    try {
      setIsLoadingGrids(true);
      setActiveTab("NOT_UPLOADED");
      const res = await axiosInstance.get("logistic/dockets/not-uploaded");
      const data = res.data || [];
      
      setGridColumns([
        { key: "courierCode", label: "Courier Code" },
        { key: "docketNo", label: "Docket No" },
        { key: "isUpload", label: "Is Upload" },
        { key: "date", label: "Date" },
      ]);
      setGridData(data);
    } catch (error) {
      toast.error("Failed to load not uploaded dockets");
    } finally {
      setIsLoadingGrids(false);
    }
  }

  // Legacy pages downloaded these lists as Excel files; export the grid currently shown.
  function handleExportGrid() {
    if (!gridData || gridData.length === 0) {
      toast.error("No data to export");
      return;
    }
    const fileNames = { DOWNLOADS: "Docket", NOT_UPLOADED: "Docket Not Uploaded" };
    try {
      exportToExcel({
        data: gridData,
        headers: gridColumns.map((c) => ({ label: c.label, key: c.key })),
        fileName: `${fileNames[activeTab] || "Export"}.xlsx`,
        sheetName: "Sheet1",
      });
    } catch (error) {
      toast.error("Export failed");
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
        </div>
      )}

      <div className="mt-10">
        <Subheading title="Docket History & Reports" />
        <div className="flex gap-4 mt-4">
           <Button variant={activeTab === "DOWNLOADS" ? "default" : "outline"} onClick={fetchDownloads} disabled={isLoadingGrids}>
             Docket Download
           </Button>
           <Button variant={activeTab === "NOT_UPLOADED" ? "default" : "outline"} onClick={fetchNotUploaded} disabled={isLoadingGrids}>
             Docket Not Uploaded
           </Button>
        </div>
      </div>

      {activeTab && (
         <div className="mt-6 transition-opacity duration-300">
            <div className="mb-3 flex justify-end">
              <Button variant="outline" onClick={handleExportGrid} disabled={isLoadingGrids || gridData.length === 0}>
                Export to Excel
              </Button>
            </div>
            <Table
               columns={gridColumns}
               rows={gridData}
               isLoading={isLoadingGrids}
            />
         </div>
      )}

    </PageSkeleton>
  );
}
