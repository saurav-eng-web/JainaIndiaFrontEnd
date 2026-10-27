"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import { exportToExcel } from "@/utils/exportToExcel";

const REPORT_TYPES = [
  { value: "available-docket", label: "Available Docket Report" },
  { value: "used-docket", label: "Used Docket Report" },
  { value: "complete-docket", label: "Complete Docket Report" },
  { value: "total-dispatch", label: "Total Dispatch Report", needsDates: true },
  { value: "total-dispatch-header", label: "Total Dispatch Header Report", needsDates: true },
];

// Legacy ReportLog.aspx: the two dispatch reports take @fromdate / @todate
const needsDates = (report) => !!REPORT_TYPES.find((r) => r.value === report)?.needsDates;

function ReportsContent() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "available-docket";

  const [selectedReport, setSelectedReport] = useState(defaultType);
  
  // Date filters (only for total-dispatch)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e) {
    e?.preventDefault();

    if (needsDates(selectedReport)) {
      if (!fromDate || !toDate) {
        toast.error("From Date and To Date are required for this report.");
        return;
      }
      if (fromDate > toDate) {
        toast.error("From Date cannot be after To Date.");
        return;
      }
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      
      const res = await axiosInstance.get(`logistic/reports/${selectedReport}`, {
        params: needsDates(selectedReport) ? { fromDate, toDate } : {},
      });
      const resData = res.data || [];
      
      setData(resData);
      
      // Dynamically generate columns based on first row of data
      if (resData.length > 0) {
        const firstRow = resData[0];
        const dynamicCols = Object.keys(firstRow).map(key => ({
          key: key,
          // Format label by capitalizing and adding spaces before uppercase letters
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
        }));
        setColumns(dynamicCols);
      } else {
        setColumns([]);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch report data");
      setData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleExport() {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    try {
      const reportLabel = REPORT_TYPES.find(r => r.value === selectedReport)?.label || "Report";
      exportToExcel({
        data: data,
        headers: columns.map(c => ({ label: c.label, key: c.key })),
        fileName: `Logistic-${reportLabel}.xlsx`,
        sheetName: "ReportData"
      });
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Export failed");
    }
  }

  return (
    <PageSkeleton title="Logistic Reports" rolesAllowed={["logistic"]} backHref="/logistic/reports-hub">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Generate Report" />
        <form onSubmit={handleSearch} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Report <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedReport}
              onChange={(e) => {
                setSelectedReport(e.target.value);
                setHasSearched(false);
                setData([]);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {REPORT_TYPES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {needsDates(selectedReport) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate"}
            </Button>
            
            {hasSearched && data.length > 0 && (
              <Button type="button" variant="outline" onClick={handleExport} className="w-full">
                Export to Excel
              </Button>
            )}
          </div>
        </form>
      </div>

      {(hasSearched || isLoading) && (
        <div>
          <Subheading title="Report Preview" />
          <div className="mt-4">
            {data.length > 0 ? (
              <Table 
                columns={columns} 
                rows={data} 
                isLoading={isLoading} 
              />
            ) : (
              !isLoading && (
                <div className="text-center text-gray-500 mt-4 p-4 border border-dashed rounded">
                  No data found for this report.
                </div>
              )
            )}
          </div>
        </div>
      )}
    </PageSkeleton>
  );
}

export default function LogisticReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
