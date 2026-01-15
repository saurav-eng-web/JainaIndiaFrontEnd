"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { logger } from "@/utils/logger";

const KnowledgePortal = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

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

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      setIsDataLoading(true);
      try {
        // Parallel calls for better performance
        const res = await axios.post("/api/documents/knowledge-portal");

        if (!isMounted) return;

        // Documents
        setDocuments(res?.data?.documents || []);

        // Claim data
      } catch (err) {
        console.error("Error fetching details:", err);

        logger.error(`Error fetching details: ${err?.message}`, "claim-approve/details");
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchAll();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  // const handleDownload = (url, filename) => {
  //   try {
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = filename || "";
  //     link.target = "_self"; // important
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     throw new Error("File download failed. Please try again.");
  //   }
  // };

  const handleDownload = (url, filename) => {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "";
        link.target = "_self"; // important
        document.body.appendChild(link);
        link.click();
        link.remove();

        resolve(true); // ✅ tell toast it succeeded
      } catch (error) {
        console.error("Download failed:", error);
        reject(new Error("File download failed. Please try again."));
      }
    });
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["ASM", "BR"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              <div className="space-y-8">
                <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
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
                          Enterd Date
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
                        documents.map((doc, index) => (
                          <tr
                            key={doc.rowNum}
                            className="transition-colors duration-200 hover:bg-[#e3f2fd]"
                          >
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              {index + 1}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm font-medium text-[#333]">
                              {doc.fileName}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              {doc.enteredDate}
                            </td>
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              <button
                                onClick={() =>
                                  toast.promise(
                                    handleDownload(
                                      doc.documentURL,
                                      doc.documentURL?.split("/").pop() || "file"
                                    ),
                                    {
                                      loading: "Downloading file...",
                                      success: "File downloaded successfully!",
                                      error: (err) =>
                                        err.message || "Failed to download file.",
                                    },
                                    { style: { minWidth: "300px" } }
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
