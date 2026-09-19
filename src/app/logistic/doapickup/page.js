"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import ImageUpload from "@/components/customui/image/ImageUpload";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import UploadProgress from "@/components/customui/UploadProgress";
import PickupStatusTable from "@/components/pickup/PickupStatusTable";
import { exportToExcel } from "@/utils/exportToExcel";
import { buildPickupExport, mapPickupRequest } from "@/utils/pickupUtils";

// TODO: confirm the logistics upload endpoint with the backend team
const UPLOAD_ENDPOINT = "TDDOAPickup/upload";

const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

// Confirms the workbook is readable and carries at least one data row
function validateWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!sheet || !sheet["!ref"]) {
          reject("The selected file has no readable sheet.");
          return;
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        if (range.e.r - range.s.r === 0) {
          reject("No data rows found in the Excel file.");
          return;
        }

        resolve(true);
      } catch (err) {
        reject(`Error reading file: ${err.message}`);
      }
    };

    reader.onerror = () => reject("Failed to read the file.");
    reader.readAsBinaryString(file);
  });
}

export default function LogisticPickupPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        Action: "LOGSELECT",
      });

      const body = res.data || {};
      const rows = body.data || body.Data || [];
      setRequests(rows.map(mapPickupRequest));
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
      toast.error("Failed to load pickup requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Exports every column LOGSELECT returns, not just the ones the table renders
  async function handleExcelDownload() {
    try {
      setIsExporting(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        Action: "LOGSELECT",
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

      await validateWorkbook(file);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(UPLOAD_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) =>
          setProgress(Math.round((event.loaded * 100) / event.total)),
        timeout: 300000,
      });

      const body = res.data || {};
      const statusCode = body.statusCode || body.StatusCode;
      const statusMsg = String(body.statusMsg || body.StatusMsg || "");

      if (statusCode && statusCode !== 200) {
        toast.error(statusMsg || "Failed to upload file");
        return;
      }

      toast.success(statusMsg || "File uploaded successfully");

      setFile(null);
      setFileName("");

      await fetchRequests();
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else {
        console.error("Error uploading file:", error);
        toast.error(error?.response?.data?.message || "Failed to upload file");
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <PageSkeleton title="TD / DOA / CN Pickup Dispatch" rolesAllowed={["logistic"]}>
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
        </div>

        <Button className="mt-6" onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Upload file"}
        </Button>
      </div>

      {isUploading && (
        <div className="mt-6 max-w-xl">
          <UploadProgress progress={progress} />
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <Subheading title="Pickup Status Tracking" />

          <Button
            variant="outline"
            onClick={handleExcelDownload}
            disabled={isLoading || isExporting}
          >
            {isExporting ? "Preparing..." : "Export to Excel"}
          </Button>
        </div>

        <PickupStatusTable rows={requests} isLoading={isLoading} />
      </div>
    </PageSkeleton>
  );
}
