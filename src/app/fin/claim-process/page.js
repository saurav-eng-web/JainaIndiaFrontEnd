"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense, useMemo } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Table from "@/components/common/Table";
import Pagination from "@/components/Pagination";
import SideBar from "@/components/SideBar";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
import { exportToExcel } from "@/utils/exportToExcel";
import { logger } from "@/utils/logger";

/* ---------------- COLUMN WIDTH CONFIG ---------------- */

const tableHeaders = [
  "id",
  "Branch",
  "ASC Code",
  "Complaint Number",
  "Serial No.",
  "Call Type",
  "Warranty",
  "Claim Substatus",
  "OK Date",
  "Assigned To",
  "ApprovedBy",
];
const excelConfig = [
  { label: "Id", value: "id" },
  { label: "Branch", value: "Branch" },
  { label: "ASC Code", value: "ASC Code" },
  { label: "Complaint No.", value: "Complaint No." },
  { label: "Serial No.", value: "Serial No." },
  { label: "Call Type", value: "Call Type" },
  { label: "Warranty", value: "Warranty" },
  { label: "Claim Substatus", value: "Claim Substatus" },
  { label: "OK Date", value: "OK Date" },
  { label: "Assigned To", value: "ExecName" },
  // { label: "ApprovedBy", value: "ApprovedBy" },
];

const excelColumns = excelConfig.map((h) => ({
  label: h.label,
  key: h.value,
}));
// const excelColumns = tableHeaders.map((h) => ({
//   label: h,
//   key: h,
// }));

// console.log("excel: ", { excelColumns, excelColumns1 });

function DetailsContent() {
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

  const router = useRouter();

  /* ---------------- DATA STATE ---------------- */
  const [challanData, setChallanData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  /* ---------------- SEARCH STATE ---------------- */
  const [search, setSearch] = useState("");

  /* ---------------- PAGINATION STATE ---------------- */
  const [pageSize, setPageSize] = useState(15); // rows per page
  const [currentPage, setCurrentPage] = useState(1); // active page

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function fetchData() {
      setIsDataLoading(true);
      try {
        const res = await axiosInstance.post("claim-process-v1/process", {
          type: "ClaimListing",
        });

        if (!isMounted) return;
        setChallanData(res?.data?.data || []);
      } catch (err) {
        toast.error("Error fetching data");
        console.error("Error fetching challan:", err);
        logger.error(`Error fetching claim data: ${err?.message}`, "pending-challan");
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return challanData;

    const query = search.toLowerCase();

    return challanData.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, challanData]);

  /* ---------------- PAGINATION CALCULATIONS ---------------- */
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedRows = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const handleExcelDownload = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          exportToExcel({
            data: challanData, // full dataset
            headers: excelColumns,
            fileName: `Finance-pending-${new Date().toISOString().slice(0, 10)}.xlsx`,
            sheetName: "pending",
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: "Preparing Excel file...",
        success: "Excel downloaded successfully",
        error: "Failed to export Excel",
      }
    );
  };

  const handleViewHistory = (ticketNo, subStatus) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    sessionStorage.setItem("subStatus", subStatus);
    router.push("/fin/history");
  };

  const columns = [
    {
      key: "history",
      label: "History",
      size: "xs",
      render: (_, row) => (
        <button
          className="cursor-pointer rounded-md bg-[#714b67] px-3.5 py-2 text-[13px] text-white transition-colors hover:bg-[#5a3c52]"
          onClick={() => handleViewHistory(row["Complaint No."], row["Claim Substatus"])}
        >
          History
        </button>
      ),
    },
    { label: "Id", key: "id", size: "sm" },
    { label: "NSP Name", key: "Branch", size: "xl" },
    { label: "ASC Code", key: "ASC Code", size: "md" },
    { label: "Complaint No", key: "Complaint No.", size: "lg" },
    {
      label: "Serial No.",
      key: "Serial No.",
      size: "lg",
    },
    { label: "Call Type", key: "Call Type", size: "sm" },
    {
      label: "Warranty",
      key: "Warranty",
      size: "lg",
    },
    { label: "Claim Substatus", key: "Claim Substatus", size: "lg" },
    { label: "OK Date", key: "OK Date", size: "md" },
  ];

  return (
    <PageSkeleton title={"Claim process"} rolesAllowed={["FinanceExec"]}>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset page on search
        }}
        className="mb-6 h-11 w-72 rounded-lg border-2 border-[#714b67] px-3 py-2 text-sm focus:ring-1 focus:ring-[#714b67] focus:outline-none"
      />

      <div className="overflow-x-hidden rounded-md border border-slate-300">
        <Table columns={columns} rows={paginatedRows} isLoading={isDataLoading} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
      />

      {!isDataLoading && challanData.length > 0 && (
        <button
          onClick={handleExcelDownload}
          className="fixed right-6 bottom-6 z-50 cursor-pointer rounded-full bg-[#714b67] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#57324d]"
        >
          Export to Excel
        </button>
      )}
    </PageSkeleton>
  );
}

export default function ClaimProcess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
