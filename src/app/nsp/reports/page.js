"use client";

import { useEffect, useState } from "react";
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
  const [options, setOptions] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const loggedInUserId = user?.userID ? String(user.userID) : "";
  const role = user?.roleName ? user.roleName : "";

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await axiosInstance.get(`ReportMaster`);

        // const {status, data}
        if (res.status === 200) {
          const filtered = res.data.filter((option) => {
            const roles = option.rolesAllowed.split(",").map((r) => r.trim());
            return roles.includes(role);
          });
          console.log(`filtered: `, filtered);
          setOptions(filtered);
        }
      } catch (error) {
        console.log(`error: `, error);
      }
    }

    fetchOptions();
  }, []);

  // filter((option) => option.role.includes(role));

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
    <ProtectedRoute allowedRoles={["br", "zone", "sf/ssd"]}>
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="min-h-screen flex-1 bg-gray-50 p-25 pt-10">
          <div className="rounded bg-white p-6">
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
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* From Date */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Report Dropdown */}
            <div className="mb-4 md:w-1/3">
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Select Report Name:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">-----Select-----</option>
                {options.map((option) => (
                  <option key={option.id} value={option.reportAct}>
                    {option.reportDis}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded px-4 py-2 font-semibold text-white"
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
