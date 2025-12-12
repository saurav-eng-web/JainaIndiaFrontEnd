"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import React, { useState } from "react";

const KnowledgePortal = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);

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
    "OK Date",
    "Customer Name",
    "Customer Mobile",
  ];

  const columnOrder = [
    "TicketKey",
    "ticket_no",
    "serialNo",
    "callType",
    "warranty",
    "DOP",
    "FinanceRemarks",
    "Action",
    "RejectionDate",
    "OKDate",
    "CustName",
    "CustMobile",
  ];

  const handleDownload = async (url, filename) => {
    try {
      // 1. Fetch the file data
      const response = await fetch(url);

      // 2. Convert to Blob (Binary Large Object)
      const blob = await response.blob();

      // 3. Create a temporary URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // 4. Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename; // This forces the download name

      // 5. Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
      logger.error(`Downloading image failed ${error.message}`, "claim-approve/details");
      // Fallback: Just open in new tab if the fetch fails (e.g. CORS error)
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["ASM", "NSP"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              <div className="space-y-8">
                <h2 className="mt-8 mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Knowledge Portal
                </h2>

                <div className="overflow-x-auto rounded-md border border-slate-300">
                  <table className="w-full min-w-max border-separate border-spacing-0 rounded-2xl text-left">
                    <thead className="rounded-2xl bg-[#714b67]">
                      <tr>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3.5 text-left text-[15px] font-semibold whitespace-nowrap text-white">
                          Document Name
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
                      {isDataLoading ? (
                        // Loading state
                        <tr>
                          <td
                            colSpan={tableHeaders.length}
                            className="p-4 text-center text-slate-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : documents.length === 0 ? (
                        // No documents found
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        // Actual document rows
                        documents.map((doc) => (
                          <tr
                            key={doc.rowNum}
                            className="transition-colors duration-200 hover:bg-[#e3f2fd]"
                          >
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              {doc.rowNum}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm font-medium text-[#333]">
                              {doc.documentType}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              {doc.enteredDate}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              <button
                                onClick={() =>
                                  handleDownload(
                                    doc?.documentURL,
                                    doc?.documentURL.split("/")[
                                      doc?.documentURL?.split("/").length - 1
                                    ]
                                  )
                                }
                                className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default KnowledgePortal;

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
