"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function ComplaintTableInner() {
  const { colors } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const subStatus = searchParams.get("subStatus");
  const roleID = searchParams.get("roleID");
  const firstID = searchParams.get("firstID");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!status || !subStatus || !roleID || !firstID) return;

    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}/CallRegister/getstatus/${encodeURIComponent(
          status
        )}/${encodeURIComponent(subStatus)}/${roleID}/${firstID}`;

        const response = await axiosInstance.get(url);
        setComplaints(response.data || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [status, subStatus, roleID, firstID]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleViewHistory = (ticketNo) => {
    sessionStorage.setItem("currentTicket", ticketNo);
    router.push("/history?fromPage=dashboardcall");
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="ml-[60px] flex-1 bg-gray-100 p-6 transition-all duration-300">
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2
            className="mb-6 font-semibold"
            style={{
              color: colors.primary,
              fontSize: 18,
              border: `2px solid ${colors.primary}`,
              padding: 8,
            }}
          >
            Complaints - {status} / {subStatus}
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-xs tracking-wider text-gray-700 uppercase">
                    <th className="px-4 py-3 text-left font-semibold">History</th>
                    <th className="px-4 py-3 text-left font-semibold">Complaint No.</th>
                    <th className="px-4 py-3 text-left font-semibold">Customer Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Call Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Sub Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            style={{ background: colors.primary }}
                            onClick={() => handleViewHistory(item.tickeT_NO)}
                          >
                            History
                          </button>
                        </td>
                        <td className="px-4 py-3">{item.tickeT_NO}</td>
                        <td className="px-4 py-3">
                          {`${item.salutation || ""} ${item.firstname || ""} ${
                            item.lastname || ""
                          }`}
                        </td>
                        <td className="px-4 py-3">{item.product}</td>
                        <td className="px-4 py-3">{item.calL_TYPE}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              item.complainT_STATUS
                            )}`}
                          >
                            {item.complainT_STATUS}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.complainT_SUBSTATUS}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ✅ Wrap the component with Suspense to avoid build-time CSR bailout error
export default function ComplaintTable() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComplaintTableInner />
    </Suspense>
  );
}
