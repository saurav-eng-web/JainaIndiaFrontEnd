"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";

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
  const [isLoading, setIsLoading] = useState(false);

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
  }, [role]);

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

  //     const response = await axiosInstance.post("/reports/downloadreports", body, {
  //       responseType: "blob",
  //     });

  //     // STEP 1 — detect if the blob is actually JSON (means error)
  //     const contentType = response.headers["content-type"];

  //     if (contentType?.includes("application/json")) {
  //       const text = await response.data.text();
  //       const json = JSON.parse(text);

  //       console.error("Report API Error:", json);

  //       if (json.detail?.includes("expired")) {
  //         alert("Session expired. Please login again.");
  //       } else if (json.error?.includes("not available")) {
  //         alert("No report available for selected criteria.");
  //       } else {
  //         alert("Unable to download report.");
  //       }

  //       return; // STOP here — do not download anything
  //     }

  //     // STEP 2 — extract filename from headers safely
  //     const cd = response.headers["content-disposition"];
  //     let fileName = "report.xlsx";

  //     if (cd) {
  //       // filename=abc.xlsx
  //       const match1 = cd.match(/filename="?([^";]+)"?/);
  //       if (match1) fileName = match1[1];

  //       // filename*=UTF-8''abc.xlsx
  //       const match2 = cd.match(/filename\*\=UTF-8''(.+)/);
  //       if (match2) fileName = decodeURIComponent(match2[1]);
  //     }

  //     // remove trailing junk
  //     fileName = fileName.split(";")[0].trim();

  //     // STEP 3 — download file
  //     const url = URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();

  //     // cleanup
  //     a.remove();
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     alert("Download failed. Check console for details.");
  //   }
  // };

  // ----------
  const handleDownload = async () => {
    if (!fromDate || !toDate || !reportType) {
      alert("Please select dates and report type");
      return;
    }
    setIsLoading(true);
    try {
      const body = {
        Type: reportType,
        UserId: loggedInUserId,
        FromDate: fromDate,
        ToDate: toDate,
      };

      const response = await axiosInstance.post("/api/proxyDownload", body, {
        responseType: "blob",
        baseURL: "",
      });

      // Extract filename from Content-Disposition
      const cd = response.headers["content-disposition"];
      let fileName = "report.xlsx";

      if (cd) {
        // 1) filename="..."
        const fnMatch = cd.match(/filename="?([^";]+)"?/);
        if (fnMatch) fileName = fnMatch[1];

        // 2) filename*=UTF-8''encoded
        const fnUtf8 = cd.match(/filename\*\=UTF-8''(.+)/);
        if (fnUtf8) fileName = decodeURIComponent(fnUtf8[1]);
      }

      // Remove any trailing garbage, if present
      fileName = fileName.split(";")[0].trim();

      // Save file
      const url = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);

      // Extract JSON error if available
      if (err.response?.data && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          alert(json.error || "Failed to download");
        } catch {
          alert("Failed to download");
        }
      } else {
        alert("Failed to download");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ------------

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

  //     // Call the Next.js proxy API instead of backend directly
  //     // const response = await fetch("/api/proxyDownload", {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //     Authorization: jwtToken,
  //     //   },
  //     //   body: JSON.stringify(body),
  //     // });

  //     const response = await axiosInstance.post("/api/proxyDownload", body, {
  //       responseType: "blob",
  //       baseURL: "", // empty overrides global baseURL
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;

  //     // Extract filename from headers
  //     const contentDisposition = response.headers["content-disposition"];
  //     let fileName = "report.csv"; // fallback
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?([^"]+)"?/);
  //       if (match?.[1]) fileName = match[1];
  //     }

  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();

  //     console.log("🔴 fileName: ", fileName);
  //     // console.log("fileName: ", fileName);
  //     // Cleanup
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     alert("Download failed");
  //   }
  // };

  return (
    <ProtectedRoute
      allowedRoles={["BR", "ZONE", "SF/SSD", "NSP", "ASM", "RSM", "HOuser"]}
    >
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
                {/*
                {options.map((option) => (
                  <option key={option.id} value={option.reportAct}>
                    {option.reportDis}
                  </option>

                ))} */}
                {options.length === 0 ? (
                  <option disabled>No reports available</option>
                ) : (
                  options.map((option) => (
                    <option key={option.id} value={option.reportAct}>
                      {option.reportDis}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`flex items-center gap-2 rounded px-6 py-3 font-semibold text-white shadow-sm transition-all ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:opacity-90 hover:shadow active:scale-95"
              }`}
              style={{ background: colors.primary }}
            >
              <FaDownload />
              {isLoading ? "Downloading..." : "Download Report"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
