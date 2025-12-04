"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import SectionHeading from "@/components/common/SectionHeading";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const dummyData = [
    {
      callNumber: "CN001",
      title: "Mr.",
      firstName: "John",
      lastName: "Doe",
      product: "Washing Machine",
      callType: "Installation",
      complaint_Status: "Open",
      complaint_SubStatus: "Waiting for parts",
    },
    {
      callNumber: "CN002",
      title: "Ms.",
      firstName: "Jane",
      lastName: "Smith",
      product: "Refrigerator",
      callType: "Repair",
      complaint_Status: "Pending",
      complaint_SubStatus: "Under review",
    },
    {
      callNumber: "CN003",
      title: "Dr.",
      firstName: "Raj",
      lastName: "Kumar",
      product: "Microwave",
      callType: "Maintenance",
      complaint_Status: "Closed",
      complaint_SubStatus: "Completed",
    },
  ];

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

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setComplaints(dummyData);
      setLoading(false);
    }, 500); // fake delay
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-20 pt-10 pr-10">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <SectionHeading>Reject Claims call</SectionHeading>

          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-200 text-xs text-gray-700 uppercase">
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Complaint No.</th>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Call Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sub Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {complaints.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/assign-to-asc/${item.callNumber}`)}
                          className="rounded-md px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4 py-3">{item.callNumber}</td>
                      <td className="px-4 py-3">{`${item.title || ""} ${item.firstName} ${item.lastName}`}</td>
                      <td className="px-4 py-3">{item.product}</td>
                      <td className="px-4 py-3">{item.callType}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            item.complaint_Status
                          )}`}
                        >
                          {item.complaint_Status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.complaint_SubStatus}</td>
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
