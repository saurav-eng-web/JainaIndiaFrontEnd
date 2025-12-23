"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { useTheme } from "@/theme/ThemeContext";
import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomDropdown from "@/components/common/Dropdown";
import axiosInstance from "@/api/axiosInstance";

export default function ChallanSearch() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [challanType, setChallanType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [results, setResults] = useState([]);

  const challanTypeOptions = [
    { label: "Defective", value: "Defective" },
    { label: "DOA", value: "DOA" },
    { label: "Good Spare", value: "goodspare" },
    { label: "Good FG", value: "GoodFG" },
    { label: "Mis Spare", value: "MisSpare" },
    { label: "Mis FG", value: "MisFG" },
  ];

  const monthOptions = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const yearOptions = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!month || !year || !challanType) {
      setMessage({ type: "error", text: "Please select all fields." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        sfId: String(user?.sF_ID ?? "0"),
        type: challanType,
        month: month,
        year: year,
      };

      const res = await axiosInstance.post("PrintChallan/GetPrintChallanList", payload);

      // If backend returns array of results
      if (Array.isArray(res.data) && res.data.length > 0) {
        setResults(res.data);
        setMessage({ type: "success", text: "Data fetched successfully" });
      }

      // If backend returns empty array
      else if (Array.isArray(res.data) && res.data.length === 0) {
        setResults([]);
        setMessage({ type: "error", text: "No records found" });
      }

      // Any other unexpected format
      else {
        setResults([]);
        setMessage({ type: "error", text: "Something went wrong" });
      }
    } catch (error) {
      console.log("API Error:", error);
      console.log("API Response:", error.response);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });

      setResults([]);
    }

    setLoading(false);
  };

  const handleAscPrint = (challanNo) => {
    router.push(`/print-asc?type=asc&pono=${challanNo}&challantype=${challanType}`);
  };

  const handleNspPrint = (challanNo) => {
    router.push(`/print-nsp?type=nsp&pono=${challanNo}&challantype=${challanType}`);
  };

  return (
    <ProtectedRoute allowedRoles={["br", "asm", "zone", "sf/ssd"]}>
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />

        <div className="flex-1 pt-10 pr-20 pl-30">
          <div className="w-full">
            <div className="rounded-2xl bg-white p-8 shadow-lg transition hover:shadow-xl">
              <h2
                className="mb-8 text-left text-2xl font-bold"
                style={{
                  color: colors.primary,
                  padding: 5,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: 5,
                }}
              >
                Challan Search
              </h2>

              {message && (
                <div
                  className={`mb-4 rounded px-4 py-2 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="grid grid-cols-3 gap-6" onSubmit={handleSearch}>
                <CustomDropdown
                  label="Month"
                  placeholder="Select Month"
                  value={month}
                  onChange={setMonth}
                  options={monthOptions}
                />

                <CustomDropdown
                  label="Year"
                  placeholder="Select Year"
                  value={year}
                  onChange={setYear}
                  options={yearOptions}
                />

                <CustomDropdown
                  label="Challan Type"
                  placeholder="Select Challan Type"
                  value={challanType}
                  onChange={setChallanType}
                  options={challanTypeOptions}
                />

                <div className="col-span-3 mt-6 flex gap-4">
                  <button
                    type="button"
                    className="rounded-lg px-6 py-2 text-sm font-medium shadow-md"
                    style={{ background: colors.primary, color: "#fff" }}
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-6 py-2 text-sm font-medium shadow-md"
                    style={{ background: colors.primary, color: "#fff" }}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </form>

              {results.length > 0 && (
                <div className="mt-10 overflow-x-auto">
                  <table className="min-w-full rounded-lg border border-gray-300">
                    <thead style={{ backgroundColor: colors.primary, color: "white" }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Challan No.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          SF Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Docket
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Print
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((item, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                        >
                          <td className="px-4 py-3 text-sm text-blue-600 underline">
                            {item.poNumber}
                          </td>

                          <td className="px-4 py-3 text-sm">{item.sfName}</td>
                          <td className="px-4 py-3 text-sm">{item.date}</td>
                          <td className="px-4 py-3 text-sm">{item.docket}</td>

                          <td className="flex gap-2 px-4 py-3 text-sm">
                            <button
                              onClick={() => handleAscPrint(item.poNumber)}
                              className="rounded-md px-3 py-1 text-xs font-medium shadow-sm"
                              style={{ backgroundColor: colors.primary, color: "#fff" }}
                            >
                              ASC Print
                            </button>

                            <button
                              onClick={() => handleNspPrint(item.poNumber)}
                              className="rounded-md px-3 py-1 text-xs font-medium shadow-sm"
                              style={{ backgroundColor: "#6B7280", color: "#fff" }}
                            >
                              NSP Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
