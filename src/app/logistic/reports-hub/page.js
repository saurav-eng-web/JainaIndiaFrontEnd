"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * 16-Nov-2026           Reworked like the legacy ReportLog.aspx ("All Reports"): the From / To date is on the page and
 *                       every report button downloads the Excel file directly (no report dropdown / preview page).
 *                       The date is required only for the two dispatch reports.
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import { FileSpreadsheet, FileText, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

const DOCKET_REPORTS = [
  { type: "complete-docket", label: "Complete Docket Report", needsDates: false, icon: "text-blue-600", bg: "bg-blue-50", hover: "hover:border-blue-300 hover:bg-blue-50/50" },
  { type: "used-docket", label: "Used Docket Report", needsDates: false, icon: "text-amber-600", bg: "bg-amber-50", hover: "hover:border-amber-300 hover:bg-amber-50/50" },
  { type: "available-docket", label: "Available Docket Report", needsDates: false, icon: "text-green-600", bg: "bg-green-50", hover: "hover:border-green-300 hover:bg-green-50/50" },
  { type: "total-dispatch", label: "Dispatch Line Report", needsDates: true, icon: "text-purple-600", bg: "bg-purple-50", hover: "hover:border-purple-300 hover:bg-purple-50/50" },
  { type: "total-dispatch-header", label: "Dispatch Header Report", needsDates: true, icon: "text-orange-600", bg: "bg-orange-50", hover: "hover:border-orange-300 hover:bg-orange-50/50" },
];

const OTHER_REPORTS = [
  {
    title: "HO Reports",
    description: "Pending call, OK call, SF PO, DOA, returns, dispatch, claim, DC, CN and more (Excel).",
    icon: <FileText className="h-8 w-8 text-teal-600" />,
    link: "/logistic/ho-reports",
  },
  {
    title: "Mobile Reports",
    description: "Mobile-brand specific operational and challan reports (Excel download).",
    icon: <Smartphone className="h-8 w-8 text-rose-600" />,
    link: "/logistic/mobile/reports",
  },
];

export default function LogisticReportsPage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [busyType, setBusyType] = useState("");

  async function handleDownload(report) {
    if (report.needsDates) {
      if (!fromDate) {
        toast.error("Please select From Date");
        return;
      }
      if (!toDate) {
        toast.error("Please select To Date");
        return;
      }
      if (fromDate > toDate) {
        toast.error("From Date cannot be after To Date.");
        return;
      }
    }

    try {
      setBusyType(report.type);
      const res = await axiosInstance.post(
        "logistic/reports/process",
        { type: "download", report: report.type, ...(report.needsDates ? { fromDate, toDate } : {}) },
        { responseType: "blob" }
      );

      if (res.status === 204 || !res.data || res.data.size === 0) {
        toast.error(`No data found for ${report.label}`);
        return;
      }

      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.label}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`${report.label} downloaded`);
    } catch (err) {
      let message = `Failed to download ${report.label}`;
      if (err?.response?.data instanceof Blob) {
        try {
          const json = JSON.parse(await err.response.data.text());
          if (json?.statusMsg) message = json.statusMsg;
        } catch (parseError) {
          console.error("Could not read the error response:", parseError);
        }
      }
      toast.error(message);
    } finally {
      setBusyType("");
    }
  }

  return (
    <PageSkeleton title="All Reports" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <Subheading title="Date Range" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">The dates are needed only for the Dispatch Line and Dispatch Header reports.</p>

        <div className="mt-8">
          <Subheading title="Scheduled Report" />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DOCKET_REPORTS.map((report) => (
              <button
                key={report.type}
                type="button"
                disabled={!!busyType}
                onClick={() => handleDownload(report)}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${report.hover}`}
              >
                <span className={`rounded-full p-3 shadow-sm ${report.bg}`}>
                  <FileSpreadsheet className={`h-8 w-8 ${report.icon}`} />
                </span>
                <span>
                  <span className="block text-base font-bold text-gray-800">{report.label}</span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {busyType === report.type ? "Downloading..." : "Click to download Excel"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <Subheading title="More Reports" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {OTHER_REPORTS.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => router.push(item.link)}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
            >
              <span className="rounded-full bg-white p-3 shadow-sm">{item.icon}</span>
              <span>
                <span className="block text-base font-bold text-gray-800">{item.title}</span>
                <span className="mt-1 block text-sm text-gray-500">{item.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </PageSkeleton>
  );
}
