"use client";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const EXPECTED_COLUMNS = [
  "First_Name",
  "Last_Name",
  "Mobile",
  "Alternate_Phone",
  "Permanent_Address",
  "Landmark",
  "Pincode",
  "Title",
  "Serial_No",
  "Model",
  "CallBy",
  "CallType",
  "Purchase_Date",
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function BulkUploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { colors } = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState({
    phase: "",
    percentage: 0,
  });

  const validateColumns = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Extract headers from first row
          const range = XLSX.utils.decode_range(sheet["!ref"]);
          const firstRow = [];
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({
              r: range.s.r,
              c: col,
            });
            const cell = sheet[cellAddress];
            firstRow.push(cell ? String(cell.v).trim() : "");
          }

          // Check for missing and extra columns
          const missing = EXPECTED_COLUMNS.filter(
            (col) => !firstRow.includes(col),
          );
          const extra = firstRow.filter(
            (col) => !EXPECTED_COLUMNS.includes(col) && col !== "",
          );

          if (missing.length > 0 || extra.length > 0) {
            let errorMessage = "❌ Column mismatch detected:\n";
            if (missing.length > 0) {
              errorMessage += `\nMissing columns: ${missing.join(", ")}`;
            }
            if (extra.length > 0) {
              errorMessage += `\nExtra columns: ${extra.join(", ")}`;
            }
            reject(errorMessage);
          } else {
            // Check if there's data
            const rowCount = range.e.r - range.s.r;
            if (rowCount === 0) {
              reject("No data rows found in the Excel file.");
            } else {
              resolve(true);
            }
          }
        } catch (err) {
          reject("Error reading file: " + err.message);
        }
      };

      reader.onerror = () => {
        reject("Failed to read the file.");
      };

      reader.readAsBinaryString(file);
    });
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];

    // Check if file type is valid
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg("Only Excel (.xlsx or .xls) files are supported.");
      setFile(null);
      setFileName("");
      e.target.value = ""; // clear file input
      return;
    }

    // Reset errors and progress if valid
    setErrorMsg("");
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setProgress({ phase: "", percentage: 0 });
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select a file first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setProgress({ phase: "Validating columns...", percentage: 0 });

    try {
      // Validate columns first
      await validateColumns(file);

      setProgress({ phase: "Uploading file...", percentage: 0 });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload file with progress tracking
      await axiosInstance.post(
        `${BASE_URL}/CallCreationUploader/create-bulk`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress({
              phase: "Uploading file...",
              percentage: percentCompleted,
            });
          },
          timeout: 300000, // 5 minutes timeout for large files
        },
      );

      setProgress({
        phase: "Complete",
        percentage: 100,
      });
    } catch (err) {
      console.error("❌ Upload failed:", err);

      if (typeof err === "string") {
        setErrorMsg(err);
      } else {
        setErrorMsg(
          err?.response?.data?.message ||
            err.message ||
            "Error uploading file. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.replace("/");
      return;
    }
    const user = JSON.parse(userData);
    const userName = user?.userName;
    const role = user.roleName?.toLowerCase();

    const isAuthorized = role === "cc" && userName === "T284977";

    if (!isAuthorized) {
      router.replace("/test");
    }
  }, [router]);

  return (
    <ProtectedRoute allowedRoles={["cc"]}>
      <div
        className="flex min-h-screen flex-col overflow-auto md:flex-row"
        style={{ backgroundColor: colors.background }}
      >
        <div className="hidden md:block">
          <SideBar />
        </div>

        <div className="flex flex-1 flex-col items-center justify-start p-4 sm:p-8 md:p-12">
          <div
            className="w-full max-w-full rounded-[16px] p-6 shadow-lg transition-all duration-300 sm:max-w-[500px] sm:p-8 md:max-w-[700px]"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            }}
          >
            <h2 className="mb-6 rounded-md border-2 border-[#714b67] px-3 py-2 text-left text-lg font-bold text-[#714b67]">
              Bulk Call Creation
            </h2>

            <div className="flex flex-col items-center gap-6">
              <h1 className="text-xl font-semibold text-[#714b67]">
                Upload Excel File
              </h1>

              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelect}
                disabled={loading}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#714b67] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#5d3d56] focus:border-[#714b67] focus:ring-2 focus:ring-[#714b67] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-0.5 text-xs text-gray-600 italic">
                Only <span className="font-semibold text-[#714b67]">.xlsx</span>{" "}
                or <span className="font-semibold text-[#714b67]">.xls</span>{" "}
                files are supported.
              </p>

              {loading && progress.phase && (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-[#714b67]">
                    <span>{progress.phase}</span>
                    <span>{progress.percentage}%</span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-[#714b67] transition-all duration-300 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {progress.phase === "Complete" && (
                <div className="rounded-md bg-green-100 p-4 text-center font-semibold text-green-800">
                  ✅ File uploaded successfully!
                </div>
              )}

              {errorMsg && (
                <pre className="w-full rounded-md bg-red-100 p-3 text-sm whitespace-pre-wrap text-red-700">
                  {errorMsg}
                </pre>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="mt-4 w-full rounded-md bg-[#714b67] px-6 py-3 font-semibold text-white transition hover:bg-[#5d3d56] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? <Loader /> : "Upload file"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      <span>Processing...</span>
    </div>
  );
}
