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
  "Part Description": "md",
  Price: "sm1",
  Date: "md",
  Status: "md",
  "Challan Type": "lg",
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

const columnOrder = [
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

const excelColumns = [
  { label: "S.No.", key: "S.No." },
  { label: "ASC Code", key: "ASC Code" },
  { label: "Complaint No", key: "Complaint No" },
  { label: "Challan Number", key: "Challan Number" },
  { label: "Part Code", key: "Part code" },
  { label: "Part Description", key: "Part Description" },
  { label: "Price", key: "Price" },
  { label: "Date", key: "Date" },
  { label: "Status", key: "Status" },
  { label: "Challan Type", key: "Challan Type" },
  { label: "Line Status", key: "Line Status" },
];

function DetailsContent() {
  // Form State
  const [challanData, setChallanData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

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

  const handleExcelDownload = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          exportToExcel({
            data: challanData,
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

  return (
    <>
      <ProtectedRoute allowedRoles={["NSP", "BR"]}>
        <SideBar />
        <div className="flex min-h-screen w-full flex-col font-sans">
          <div className="mx-auto w-full max-w-[1400px] p-4">
            {/* Main Card Container */}
            <div className="rounded-xl p-6 sm:p-10">
              <div className="space-y-8">
                <h2 className="mb-8 rounded-md border-2 border-[#714b67] p-1.5 pl-2.5 text-left text-lg font-bold text-[#714b67]">
                  Pending Challans at Warehouse
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
                        challanData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-[#f1faff]">
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
                {!isDataLoading && challanData.length > 0 && (
                  <button
                    onClick={handleExcelDownload}
                    className="fixed right-6 bottom-6 z-50 cursor-pointer rounded-full bg-[#714b67] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#57324d]"
                  >
                    Export to Excel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

// function Th({ title }) {
//   return (
//     <th className="px-4 py-3.5 text-left text-[15px] font-semibold text-white">
//       {title}
//     </th>
//   );
// }

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

// function Td({ data }) {
//   return (
//     <td className="border-b border-[#e0e0e0] px-4 py-3.5 align-middle text-sm text-[#333]">
//       {data}
//     </td>
//   );
// }

export default function PendingChallan() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
