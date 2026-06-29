"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import SideBar from "@/components/SideBar";
import InputField from "@/components/customui/InputWithLabel";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
import { setRouteData } from "@/redux/slices/routeDataSlice";
import { useTheme } from "@/theme/ThemeContext";
import { formatIndianDate } from "@/utils/formatDate";
import { logger } from "@/utils/logger";

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
  "Request Date": "md",
  Complaint_SubStatus: "xl",
};

const tableHeaders = [
  "",
  "Ticket No",
  "Model",
  "Product",
  "Customer",
  "Request Date",
  "Complaint substatus",
];

const columnOrder = [
  "Ticket_No",
  "MODEL",
  "PRODUCT",
  "Custname",
  "NSPRequestDate",
  "Complaint_SubStatus",
];

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
  const dispatch = useDispatch();

  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;
  const router = useRouter();

  const handleViewHistory = (details) => {
    const { ticketNo, nspAmount, nspRemarks, nspAllowanceType } = details;
    sessionStorage.setItem("currentTicket", ticketNo);
    sessionStorage.setItem("fromPage", "special-allowance-request");
    const nspData = {
      nspAmount,
      nspRemarks,
      nspAllowanceType,
    };

    dispatch(setRouteData({ key: "nspData", data: nspData }));

    router.push("/history");
  };

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
        const res = await axiosInstance.post("/SpecialAllowance/manage", {
          Action: "SELECT_BY_RSM",
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

  return (
    <PageSkeleton title="Special Allowance Requests" rolesAllowed={["RSM", "zone"]}>
      <input
        type="text"
        placeholder="Search"
        value={search}
        className="mb-6 h-11 w-72 rounded-lg border-2 border-[#714b67] bg-white px-3 py-2 transition-all outline-none focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]"
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
                      onClick={() =>
                        handleViewHistory({
                          ticketNo: row["Ticket_No"],
                          nspAmount: row["NSPRequestAmount"],
                          nspRemarks: row["NSPRemarks"],
                          nspAllowanceType: row["SpecialApprovaltype"],
                        })
                      }
                    >
                      History
                    </button>
                  </td>
                  {columnOrder.map((key, colIndex) => (
                    <Td
                      key={`${rowIndex}-${colIndex}`}
                      data={
                        key === "NSPRequestDate" ? formatIndianDate(row[key]) : row[key]
                      }
                      header={key}
                    />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {visibleRows.length > 14 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />
      )}
    </PageSkeleton>
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
