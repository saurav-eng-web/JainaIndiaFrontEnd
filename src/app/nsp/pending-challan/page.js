"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { logger } from "@/utils/logger";
import axiosInstance from "@/api/axiosInstance";
import { getUserFromLocalStorage } from "@/redux/slices/authSlice";
import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import PageSkeleton from "@/components/ui/PageSkeleton";

/* ---------------- COLUMN WIDTH CONFIG ---------------- */

const sizeClassMap = {
  sm: "w-[60px]",
  sm1: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[160px]",
  xl: "w-[220px]",
};

const columnSizes = {
  "S.No.": "sm",
  "ASC Code": "md",
  "Complaint No": "md",
  "Challan Number": "md",
  "Part code": "md",
  "Part Description": "xl",
  Price: "sm1",
  Date: "sm1",
  Status: "lg",
  "Challan Type": "md",
  "Line Status": "lg",
};

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

const columnOrder = [...tableHeaders];

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
  // pending challan at warehouse
  return (
    <PageSkeleton
      title={"Pending Challan at Warehouse"}
      rolesAllowed={["ASM", "ZONE", "BR", "SF/SSD"]}
    >
      {/* ---------------- SEARCH INPUT ---------------- */}
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

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-x-hidden rounded-md border border-slate-300">
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
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="p-4 text-center text-slate-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-[#f1faff]">
                  {columnOrder.map((key, colIndex) => (
                    <Td key={`${rowIndex}-${colIndex}`} data={row[key]} header={key} />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
      />

      {/* ---------------- EXCEL BUTTON ---------------- */}
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

/* ---------------- TABLE CELLS ---------------- */

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
      className={`border-b border-[#e0e0e0] px-3 py-2 text-sm text-[#333] ${sizeClassMap[size]} break-words whitespace-normal`}
      title={String(data ?? "")}
    >
      {data ?? "-"}
    </td>
  );
}

/* ---------------- PAGE WRAPPER ---------------- */

export default function PendingChallan() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
