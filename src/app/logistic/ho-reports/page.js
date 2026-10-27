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
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { Button } from "@/components/customui/button";
import { logger } from "@/utils/logger";

/*
 * Legacy root Reports.aspx ("New HO Reports" in the Logistic menu):
 * reportsNew(@fromdate, @todate, @type, @userid) downloaded as Excel.
 * Uses the existing shared API Reports/downloadreports through /api/proxyDownload (same as nsp/reports).
 */
const HO_REPORTS = [
  { value: "OpencallReport", label: "Pending Call Report" },
  { value: "OkCall", label: "OK Call Report" },
  { value: "RegCall", label: "Registered Call" },
  { value: "PartCon", label: "Part Consumption" },
  { value: "partpend", label: "SF PO" },
  { value: "DOA PO", label: "DOA PO" },
  { value: "Defective Return", label: "Defective Return" },
  { value: "Defective Return DOA", label: "Defective Return FG" },
  { value: "GoodRe", label: "Good Spare return" },
  { value: "Totaldispatch", label: "Total Dispatch" },
  { value: "claimprocess", label: "Claim Report" },
  { value: "completedoatd", label: "Complete DOA-TD" },
  { value: "newtddoa", label: "New DOA TD" },
  { value: "DC", label: "DC Report" },
  { value: "SMS", label: "SMS Delivery" },
  { value: "CN", label: "CN" },
  { value: "SFpartpend", label: "SF Part Pending Report" },
];

const INPUT_CLASS =
  "w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function saveBlob(response, fallbackName) {
  const cd = response.headers?.["content-disposition"];
  let fileName = fallbackName;
  if (cd) {
    const utf8 = cd.match(/filename\*=UTF-8''(.+)/);
    const plain = cd.match(/filename="?([^";]+)"?/);
    if (utf8) fileName = decodeURIComponent(utf8[1]);
    else if (plain) fileName = plain[1];
  }
  const url = URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.split(";")[0].trim();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LogisticHoReportsPage() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.userID ? String(user.userID) : "";

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
      const response = await axiosInstance.post(
        "/api/proxyDownload",
        { Type: reportType, UserId: userId, FromDate: fromDate, ToDate: toDate },
        { responseType: "blob", baseURL: "" }
      );
      saveBlob(response, `${reportType}.xlsx`);
      toast.success("Report downloaded");
    } catch (err) {
      let message = "Failed to download report";
      if (err?.response?.data instanceof Blob) {
        try {
          const json = JSON.parse(await err.response.data.text());
          message = json.error || json.message || message;
        } catch {
          // keep default message
        }
      }
      toast.error(message);
      logger.error(`HO report download failed: ${message}`, "Logistic HO Reports", {
        reportType,
        fromDate,
        toDate,
        status: err?.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageSkeleton title="HO Reports" rolesAllowed={["logistic"]} backHref="/logistic/reports-hub">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Subheading title="Download Report" />
        <form onSubmit={handleDownload} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Report Name <span className="text-red-500">*</span>
            </label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={INPUT_CLASS}>
              <option value="">---Select---</option>
              {HO_REPORTS.map((r) => (
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
