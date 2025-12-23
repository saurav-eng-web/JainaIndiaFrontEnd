"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useTheme } from "@/theme/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { logger } from "@/utils/logger";
import axiosInstance from "@/api/axiosInstance";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
// import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import InputField from "@/components/ui/InputWithLabel";

const sizeClassMap = {
  sm: "w-[60px]",
  sm1: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[160px]",
  xl: "w-[220px]",
};

const columnSizes = {
  TICKET_NO: "md",
  MODEL: "md",
  PRODUCT: "lg",
  Customer: "lg",
  Complaint_SubStatus: "xl",
};

const tableHeaders = [
  "",
  "Ticket No",
  "Model",
  "Product",
  "Customer",
  "Complaint substatus",
];

const columnOrder = ["TICKET_NO", "MODEL", "PRODUCT", "Customer", "Complaint_SubStatus"];

function DetailsContent() {
  // Form State
  const INITIALPAGESIZE = 15;
  const [search, setSearch] = useState("");
  const [approvalData, setApprovalData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [pageSize, setPageSize] = useState(INITIALPAGESIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApprovalData = React.useMemo(() => {
    if (!search.trim()) return approvalData;

    const query = search.toLowerCase();

    return approvalData.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, approvalData]);

  const totalItems = filteredApprovalData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleRows = filteredApprovalData.slice(startIndex, endIndex);

  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;
  const router = useRouter();

  // 🔁 reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function fetchSpecialAllowanceList() {
      setIsDataLoading(true);
      try {
        const res = await axiosInstance.post("/asc-pending-challan/list", {
          Id: userId,
          Type: "SAL",
        });

        if (!isMounted) return;

        setApprovalData(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching challan:", err);
        logger.error(`Error fetching challan: ${err?.message}`, "pending-challan");
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchSpecialAllowanceList();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [approvalData, pageSize]);

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    sessionStorage.setItem("fromPage", "special-approval");
    router.push("/history");
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["BR", "NSP"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              <div className="space-y-8">
                <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Request Special Allowance
                </h2>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  // className="mb-3 w-72 rounded border px-3 py-2 text-sm focus:outline-none"
                  className="h-11 w-72 rounded-lg border-2 border-[#714b67] bg-white px-3 py-2 transition-all outline-none focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="mt-1 overflow-x-auto rounded-md border border-slate-300">
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
                      ) : approvalData.length === 0 ? (
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
                                onClick={() => handleViewHistory(row["TICKET_NO"])}
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
