"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";

import { useTheme } from "@/theme/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { logger } from "@/utils/logger";
import axiosInstance from "@/api/axiosInstance";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";

const sizeClassMap = {
  sm: "w-[60px]",
  sm1: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[160px]",
  xl: "w-[220px]",
};

const columnSizes = {
  History: "sm1",
  "ASC Code": "md",
  "Complaint No": "md",
  "Challan Number": "md",
  "Part code": "md",
  "Part Description": "xl",
  Date: "sm1",
  Status: "lg",
};

const tableHeaders = [
  "History",
  "ASC Code",
  "Complaint No",
  "Challan Number",
  "Part code",
  "Part Description",
  "Date",
  "Status",
];

const columnOrder = [
  "ASC Code",
  "Complaint No",
  "Challan Number",
  "Part code",
  "Part Description",
  "Date",
  "Status",
];

function DetailsContent() {
  // Form State
  const [challanData, setChallanData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = challanData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleRows = challanData.slice(startIndex, endIndex);

  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function fetchChallan() {
      setIsDataLoading(true);
      try {
        const res = await axiosInstance.post("/asc-pending-challan/list", {
          Id: userId,
          Type: "CHP",
        });

        if (!isMounted) return;

        setChallanData(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching challan:", err);
        logger.error(`Error fetching challan: ${err?.message}`, "pending-challan");
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchChallan();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [challanData, pageSize]);

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    sessionStorage.setItem("fromPage", "special-approval");
    router.push("/history");
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["ASM"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              <div className="space-y-8">
                <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Speical Allowances
                </h2>
                <div className="mt-4 overflow-x-auto rounded-md border border-slate-300">
                  <table className="w-full table-fixed border-separate border-spacing-0">
                    <thead className="bg-[#714b67]">
                      <tr>
                        {tableHeaders.map((header) => (
                          <Th key={header} title={header} />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isDataLoading ? (
                        <tr>
                          <td
                            colSpan={tableHeaders.length}
                            className="p-4 text-center text-slate-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : challanData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={tableHeaders.length}
                            className="p-4 text-center text-slate-500"
                          >
                            No data available
                          </td>
                        </tr>
                      ) : (
                        visibleRows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-[#f1faff]">
                            <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
                              <button
                                className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors duration-300 hover:bg-[#5a3c52]"
                                onClick={() => handleViewHistory(row["Complaint No"])}
                              >
                                History
                              </button>
                            </td>
                            {columnOrder.map((key, colIndex) => (
                              <Td
                                key={`${rowIndex}-${colIndex}`}
                                data={row[key]}
                                header={key}
                              />
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

function Th({ title }) {
  const size = columnSizes[title] || "md";

  return (
    <th
      className={`px-3 py-3 text-left text-[14px] font-semibold text-white ${sizeClassMap[size]} truncate`}
      title={title}
    >
      {title}
    </th>
  );
}

function Td({ data, header }) {
  const size = columnSizes[header] || "md";

  return (
    <td
      className={`border-b border-[#e0e0e0] px-3 py-2 align-middle text-sm text-[#333] ${sizeClassMap[size]} wrap-break-word whitespace-normal`}
      title={String(data ?? "")}
    >
      {data ?? "-"}
    </td>
  );
}

export default function SpecialApproval() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
