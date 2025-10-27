"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import { FaDownload } from "react-icons/fa";
import axiosInstance from "@/api/axiosInstance";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { colors } = useTheme();

  // ✅ State for form inputs
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("");
  const { user } = useSelector((state) => state.auth);
  const loggedInUserId = user?.userID ? String(user.userID) : "";

  // const handleDownload = async () => {
  //   if (!fromDate || !toDate || !reportType) {
  //     alert("Please select From Date, To Date and Report");
  //     return;
  //   }

  //   try {
  //     const body = {
  //       Type: reportType,
  //       UserId: loggedInUserId,
  //       FromDate: fromDate,
  //       ToDate: toDate,
  //     };

  //     const response = await axiosInstance.post(
  //       "/reports/downloadreports",
  //       body,
  //       { responseType: "blob" }
  //     );
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;

  //     // ✅ Extract filename from backend
  //     const contentDisposition = response.headers["content-disposition"];
  //     let fileName = "report.csv"; // fallback

  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?([^"]+)"?/);
  //       if (match?.[1]) {
  //         fileName = match[1];
  //       }
  //     }

  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     alert("Download failed");
  //   }
  // };

  const handleDownload = async () => {
    if (!fromDate || !toDate || !reportType) {
      alert("Please select From Date, To Date and Report");
      return;
    }

    try {
      const body = {
        Type: reportType,
        UserId: loggedInUserId,
        FromDate: fromDate,
        ToDate: toDate,
      };

      // Call the Next.js proxy API instead of backend directly
      // const response = await fetch("/api/proxyDownload", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: jwtToken,
      //   },
      //   body: JSON.stringify(body),
      // });

      const response = await axiosInstance.post("/api/proxyDownload", body, {
        responseType: "blob",
        baseURL: "", // empty overrides global baseURL
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;

      // Extract filename from headers
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "report.csv"; // fallback
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["br", "zone"]}>
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="flex-1 p-25 pt-10 bg-gray-50 min-h-screen">
          <div className="bg-white p-6 rounded">
            {/* Heading */}
            <h2
              className="mb-4"
              style={{
                color: colors.primary,
                padding: 5,
                fontWeight: 700,
                fontSize: 18,
                border: `2px solid ${colors.primary}`,
                borderRadius: 5,
              }}
            >
              All Reports
            </h2>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* From Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Report Dropdown */}
            <div className="mb-4 md:w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Report Name:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">---Select---</option>
                <option value="OpencallReport">Open Call Report</option>
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded"
              style={{ background: colors.primary }}
            >
              <FaDownload />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
