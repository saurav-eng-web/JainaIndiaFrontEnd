"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/ui/Dropdown";
import InputField from "@/components/ui/InputWithLabel";
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

  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- DATA STATE ---------------- */
  const [stockData, setStockData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(15); // rows per page
  const [currentPage, setCurrentPage] = useState(1); // active page

  const [stockTypes, setStockTypes] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function getDropdown() {
      try {
        setIsDataLoading(true);
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "InventoryType",
          dispatchType: "",
        });

        const dropdownData = res.data.data.map((item) => {
          return {
            label: item.value,
            value: item.value,
          };
        });
        setStockTypes(dropdownData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsDataLoading(false);
      }
    }
    getDropdown();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function fetchStock() {
    if (!selectedStockType) {
      toast.error("Please select a stock type");
      return;
    }

    setIsDataLoading(true);

    const toastId = toast.loading("Fetching stock...");

    try {
      const res = await axiosInstance.post("stock-by-sf/process", {
        type: "ok",
        inventorytype: selectedStockType?.value || "",
      });

      if (res.data?.statusCode === 200 && res.data?.statusMsg === "Records Found") {
        setStockData(res.data.data);
      } else {
        throw new Error(res.data?.statusMsg || "No records found");
      }

      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to fetch stock data");

      logger.error(`Error fetching stock data: ${err?.message}`, "current-stock");
    } finally {
      setIsDataLoading(false);
    }
  }

  /* ---------------- SEARCH FILTERING ---------------- */

  const filteredData = useMemo(() => {
    if (!search.trim()) return stockData;

    const query = search.toLowerCase();

    return stockData.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, stockData]);

  const totalItems = filteredData?.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedRows = useMemo(() => {
    return filteredData?.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const handleExcelDownload = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          exportToExcel({
            data: stockData,
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
    // { label: "Model", key: "model", size: "md" },
    { label: "Part Code", key: "PartCode", size: "md" },
    { label: "Description", key: "Part Description", size: "xl" },
    { label: "MSL Qty", key: "MSLSTock", size: "sm" },
    { label: "PNA Qty", key: "PNASTock", size: "sm" },
    { label: "Total Qty", key: "TotalOKQty", size: "sm" },
  ];

  return (
    <PageSkeleton title={"Current Stock"} rolesAllowed={["SF/SSD"]}>
      <div className="mb-6 grid grid-cols-4">
        <div className="flex">
          <Dropdown
            label="Select stock type"
            required
            value={selectedStockType}
            onChange={(e) => setSelectedStockType(e)}
            options={stockTypes}
          />
        </div>
        <Button onClick={fetchStock} className="mt-6 ml-6 w-32">
          {isLoading ? "Loading..." : "Fetch Data"}
        </Button>
        <InputField
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="col-start-4 w-full justify-end"
        />
      </div>

      <div className="mt-8 overflow-x-hidden rounded-md">
        {selectedStockType === null || stockData === null ? (
          <div className="p-6 text-center text-sm text-slate-600">
            Please select a stock type and click "Fetch Data" to view current stock.
          </div>
        ) : (
          <Table columns={columns} rows={paginatedRows} isLoading={isDataLoading} />
        )}
      </div>

      {stockData?.length > 15 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />
      )}
      {/* 
      {!isDataLoading && stockData.length > 0 && (
        <button
          onClick={handleExcelDownload}
          className="fixed right-6 bottom-6 z-50 rounded-full bg-[#714b67] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#57324d]"
        >
          Export to Excel
        </button>
      )} */}
    </PageSkeleton>
  );
}

export default function CurrentStock() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
