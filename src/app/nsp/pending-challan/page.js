"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Table from "@/components/common/Table";
import Pagination from "@/components/Pagination";
import SideBar from "@/components/SideBar";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
import { exportToExcel } from "@/utils/exportToExcel";
import { logger } from "@/utils/logger";

/* ---------------- COLUMN WIDTH CONFIG ---------------- */

const tableHeaders = [
  "S.No.",
  "ASC Code",
  "Complaint No",
  "Challan Number",
  "Part code",
  "Part Description",
  "Price",
  "Date",
  "Status",
  "Challan Type",
  "Line Status",
];

const excelColumns = tableHeaders.map((h) => ({
  label: h,
  key: h,
}));

function DetailsContent() {
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

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

  /* ---------------- SEARCH FILTERING ---------------- */
  // Filters full dataset based on search query
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

  // Rows that will actually be rendered
  const paginatedRows = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  /* ---------------- RESET PAGE ON SEARCH / PAGE SIZE ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  /* ---------------- EXCEL EXPORT ---------------- */
  const handleExcelDownload = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          exportToExcel({
            data: challanData, // full dataset
            headers: excelColumns,
            fileName: `pending-challans-${new Date().toISOString().slice(0, 10)}.xlsx`,
            sheetName: "Pending Challans",
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

  const columns = [
    {
      label: "S.No.",
      key: "sr",
      size: "xs",
      render: (_v, _row, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { label: "Complaint No", key: "Complaint No", size: "md" },
    { label: "Challan Number", key: "Challan Number", size: "md" },
    { label: "Part code", key: "Part code", size: "md" },
    { label: "Part Description", key: "Part Description", size: "xl" },
    {
      label: "Price",
      key: "Price",
      size: "sm",
      render: (v) => `₹ ${Number(v).toFixed(2)}`,
    },
    { label: "Date", key: "Date", size: "sm" },
    {
      label: "Status",
      key: "Status",
      size: "lg",
      render: (v) => (
        <span className={`rounded-full py-1 text-xs font-semibold`}>{v}</span>
      ),
    },
    { label: "Challan Type", key: "Challan Type", size: "md" },
    { label: "Line Status", key: "Line Status", size: "lg" },
  ];

  return (
    <PageSkeleton
      title={"Pending Challan at Warehouse"}
      rolesAllowed={["ASM", "ZONE", "BR", "SF/SSD"]}
    >
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
          className="fixed right-6 bottom-6 z-50 rounded-full bg-[#714b67] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#57324d]"
        >
          Export to Excel
        </button>
      )}
    </PageSkeleton>
  );
}

export default function PendingChallan() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
