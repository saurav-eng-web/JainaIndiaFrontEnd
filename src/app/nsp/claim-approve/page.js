"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import SectionHeading from "@/components/common/SectionHeading";
import axiosInstance from "@/api/axiosInstance";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchClaimData = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("ClaimProcess/select", {
        userId: 48694,
        type: "Open",
        action: "Select",
      });

      if (res?.data?.status) {
        setComplaints(res.data.table1 || []);
      } else {
        setError("No data found");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-20 pt-10 pr-10">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <SectionHeading>Reject Claims call</SectionHeading>

          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-200 text-xs text-gray-700 uppercase">
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Ticket No</th>
                    <th className="px-4 py-3">ASC Name</th>
                    <th className="px-4 py-3">Call Type</th>
                    <th className="px-4 py-3">Serial No</th>
                    <th className="px-4 py-3">Finance Remarks</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {complaints.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/nsp/claim-approve/details`)}
                          className="rounded-md px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Update
                        </button>
                      </td>

                      <td className="px-4 py-3">{item.ticket_no}</td>
                      <td className="px-4 py-3">{item.asC_NAME}</td>
                      <td className="px-4 py-3">{item.callType}</td>
                      <td className="px-4 py-3">{item.serialNo}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.financeRemarks || "-"}
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
  );
}
