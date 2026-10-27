"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { Button } from "@/components/customui/button";

// Legacy Mob/reportsm.aspx: reportsm(@fromdate, @todate, @type, @userid) downloaded as Excel.
const MOBILE_REPORTS = [
  { value: "OpencallReport", label: "Open call Report" },
  { value: "JobsheetMaster", label: "JobsheetMaster" },
  { value: "ReverseLogistic", label: "Reverse Logistic" },
  { value: "partconsumption", label: "Part consumption" },
  { value: "STNreport", label: "STN report" },
  { value: "Inventory", label: "Inventory report" },
  { value: "Gooddefectivereturn", label: "Good/defective return" },
  { value: "BOMReport", label: "BOM Report" },
  { value: "PartPriceList", label: "Part Price List" },
  { value: "LogisticRevRep", label: "Logistic Reverse Report" },
  { value: "LogisticFwdRep", label: "Logistic Forward Report" },
  { value: "PendingDispatchSp", label: "Pending for dispatch NWH" },
  { value: "ASCMaster", label: "ASC Master" },
  { value: "Claim", label: "Claim Summary" },
  { value: "ClaimDetail", label: "Claim detail" },
];

const INPUT_CLASS =
  "w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function LogisticMobileReportsPage() {
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload(e) {
    e.preventDefault();
    if (!reportType) {
      toast.error("Please select a report");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("From Date and To Date are required");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From Date cannot be after To Date");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post(
        "logistic/mobile/reports/download",
        { type: reportType, fromDate, toDate },
        { responseType: "blob" }
      );
      if (res.status === 204 || !res.data || res.data.size === 0) {
        toast.error("No data found for the selected period");
        return;
      }
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err) {
      let message = "Failed to download report";
      if (err?.response?.data instanceof Blob) {
        try {
          const json = JSON.parse(await err.response.data.text());
          message = json.message || message;
        } catch {
          // keep default message
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageSkeleton title="Mobile Reports" rolesAllowed={["logistic"]} backHref="/logistic/reports-hub">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Subheading title="Download Report" />
        <form onSubmit={handleDownload} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Report Name <span className="text-red-500">*</span>
            </label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={INPUT_CLASS}>
              <option value="">---Select---</option>
              {MOBILE_REPORTS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Downloading..." : "Download Report"}
            </Button>
          </div>
        </form>
      </div>
    </PageSkeleton>
  );
}
