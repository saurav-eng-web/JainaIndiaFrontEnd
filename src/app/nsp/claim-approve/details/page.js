"use client";

import React, { useState } from "react";
import axios from "axios";

import { useTheme } from "@/theme/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { logger } from "@/utils/logger";

const tableHeaders = [
  "Id",
  "Complaint Number",
  "Serial Number",
  "Call Type",
  "Warranty",
  "DOP",
  "Finance Remarks",
  "Rejection Reason",
  "Rejection Date",
  "OK Call Date",
  "Customer Name",
  "Customer Mobile",
];

const tableRows = [
  {
    id: "JAI-2025-00123",
    complaintNumber: "CMP-458921",
    serialNumber: "SN-8791-XY23",
    callTye: "Installation",
    warranty: "Within Warranty",
    dop: "2024-02-15",
    financeRemarks: "Approved by Finance Team",
    rejectionReason: "Not Applicable",
    rejecetionDate: "-",
    OKCallDate: "2025-01-12",
    customerName: "Rahul Sharma",
    customerMobile: "9876543210",
  },
];

// --- Sub-components for Table ---
function Th({ title }) {
  return (
    <th className="px-4 py-3.5 text-left text-[15px] font-semibold text-white">
      {title}
    </th>
  );
}

function Td({ data }) {
  return (
    <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
      {data}
    </td>
  );
}

// --- Main Content Component ---
export default function ComplaintDetailsContent() {
  const { colors } = useTheme();

  // Form State
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);

  const username = process.env.NEXT_PUBLIC_DOC_USERNAME;
  const password = process.env.NEXT_PUBLIC_DOC_PASSWORD;
  const accessCode = process.env.NEXT_PUBLIC_DOC_ACCESSCODE;
  const BASE_URL = process.env.NEXT_PUBLIC_DOC_BASE_URL;

  // Documents Data
  const documents = [
    { id: 1, srNo: 1, type: "Invoice Document", date: "17 Nov 2025" },
    { id: 2, srNo: 1, type: "Serial No. Document", date: "17 Nov 2025" },
    { id: 3, srNo: 2, type: "Serial No. Document", date: "17 Nov 2025" },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Ticket_no", "123455674");
    formData.append("DocumentType", "Claim Resubmit Document");
    formData.append("accessCode", accessCode);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/DocumentUpload/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload success", res.data);
      alert("Uploaded successfully");
    } catch (err) {
      console.error("Upload error", err);
      logger.error(`Upload error: ${err.message}`, "uploading file claim approve");
      alert("Upload failed");
    }
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["sf/ssd"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto mt-10 w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              {/* shadow-md */}
              {/* Header */}
              <div className="space-y-8">
                <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Complaint Details
                </h2>

                <div className="mt-4 overflow-x-auto rounded-md border border-slate-300">
                  <table className="border-separate border-spacing-0">
                    <thead className="bg-[#714b67]">
                      <tr>
                        {tableHeaders.map((header) => (
                          <Th key={header} title={header} />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={tableHeaders.length}
                            className="p-4 text-center text-slate-500"
                          >
                            No data available
                          </td>
                        </tr>
                      ) : (
                        tableRows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="transition-colors duration-200 even:bg-[#f1faff] hover:bg-[#e3f2fd]"
                          >
                            {Object.values(row).map((item, colIndex) => (
                              <Td key={`${rowIndex}-${colIndex}`} data={item} />
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <h2 className="mt-16 mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Documents
                </h2>

                <div className="overflow-x-auto rounded-md border border-slate-300">
                  <table className="w-full min-w-max border-separate border-spacing-0 rounded-2xl text-left">
                    <thead className="rounded-2xl bg-[#714b67]">
                      <tr>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Document Type
                        </th>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Entered Date
                        </th>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <tr
                          key={doc.id}
                          className="transition-colors duration-200 hover:bg-[#e3f2fd]"
                        >
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {doc.srNo}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm font-medium text-[#333]">
                            {doc.type}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            {doc.date}
                          </td>
                          <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                            <button className="group flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                              {/* <Download className="h-4 w-4 transition-transform group-hover:scale-110" /> */}
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 3: Input Area (Remarks & Image Upload) */}
                <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="remarks"
                        className="block text-sm font-bold text-[#714b67]"
                      >
                        Remarks:
                      </label>
                      <textarea
                        id="remarks"
                        rows={4}
                        className="w-full resize-none rounded-md border border-[#714b67] bg-white px-3 py-2 text-sm shadow-sm transition-all outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#714b67]"
                        placeholder="Enter remarks here..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#714b67]">
                        Image Upload
                      </label>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <label className="group relative cursor-pointer">
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                          <div className="flex items-center gap-2 rounded-md bg-[#714b67] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#5a3c52]">
                            {/* <Upload className="h-4 w-4" /> */}
                            <span className="whitespace-nowrap">Choose Files</span>
                          </div>
                        </label>
                        <span className="max-w-xs truncate text-sm text-slate-500 italic">
                          {file ? file.name : "No file chosen"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Actions */}
                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-bold text-[#714b67] transition-colors hover:bg-[#714b67] hover:text-white focus:outline-none sm:flex-none">
                    {/* <Save className="mr-2 h-4 w-4" /> */}
                    Back
                  </button>
                  <button
                    onClick={handleUpload}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#714b67] px-8 text-sm font-bold text-white transition-colors hover:bg-[#5a3c52] focus:outline-none sm:flex-none"
                  >
                    {/* <ArrowLeft className="mr-2 h-4 w-4" /> */}
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
