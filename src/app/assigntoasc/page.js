"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import SectionHeading from "@/components/common/SectionHeading";

export default function AssignToAscForm() {
  const { colors } = useTheme();
  const router = useRouter();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const { user } = useSelector((state) => state.auth);

  const complaintOptions = [
    { label: "----Select----", value: "" },
    { label: "Software update", value: "Software update" },
    { label: "Feature Explained", value: "Feature Explained" },
    { label: "External Adjustment done", value: "External Adjustment done" },
    { label: "Customer own issue", value: "Customer own issue" },
    { label: "Product damage/Liquid logged", value: "Product damage/Liquid logged" },
    {
      label: "OW Call Customer not ready to pay",
      value: "OW Call Customer not ready to pay",
    },
    { label: "Invalid call", value: "Invalid call" },
    { label: "Other", value: "Other" },
  ];

  const loggedInUser = user?.userName || "Unknown";
  const loggedInUserId = user?.userID || 0;

  useEffect(() => {
    const storedComplaint = localStorage.getItem("selectedComplaint");
    if (storedComplaint) {
      setComplaint(JSON.parse(storedComplaint));
    }
    setLoading(false);
  }, []);

  const handleApiCall = async (actionType) => {
    if (!complaint?.tickeT_NO || !remarks) {
      Swal.fire("Error", "Ticket No and Remarks are required", "error");
      return;
    }

    try {
      await axiosInstance.post(
        `/CallRegister/approveOrUpdate`,
        {},
        {
          params: {
            ticketNo: complaint.tickeT_NO,
            userId: loggedInUserId,
            action: actionType,
            remarks,
            ascCode: complaint.asC_CODE || "ASC-001",
            dropdownSelection: selectedOption || "Option1",
            complaintStatus: actionType === "Close" ? "Ok" : "ToAllot",
            enteredBy: loggedInUser,
            category: complaint.category || "Electrical",
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text:
          actionType === "Close"
            ? `Complaint ${complaint.tickeT_NO} closed successfully!`
            : `Complaint ${complaint.tickeT_NO} assigned to ASC successfully!`,
        confirmButtonText: "OK",
      });

      router.push("/technicalApproval");
    } catch (err) {
      Swal.fire("Error", `Failed to ${actionType} complaint`, "error");
    }
  };

  if (loading) return <p className="p-6 text-sm text-gray-600">Loading...</p>;
  if (!complaint) return <p className="p-6 text-sm text-gray-600">No complaint found.</p>;

  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="ml-[60px] w-full transition-all">
        <div className="mx-10 mt-8 rounded-xl p-6 shadow-lg">
          <SectionHeading>Technical Approval</SectionHeading>

          <div className="grid grid-cols-1 gap-x-5 gap-y-6 text-sm font-medium text-gray-700 md:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">Ticket No</p>
              <p className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                {complaint.tickeT_NO}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">ASC Code</p>
              <p className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                {complaint.asC_CODE || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">ASC Name</p>
              <p className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                {complaint.asc_Name || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">Issue Description</p>
              <p className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                {complaint.faultVoc || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">Product</p>
              <p className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                {complaint.product}-{complaint.model}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                Select Option (In case of job close)
              </label>
              <CustomDropdown
                options={complaintOptions}
                value={selectedOption}
                onChange={(val) => setSelectedOption(val)}
                placeholder="----Select----"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-gray-700">Remarks</p>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remarks here..."
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => handleApiCall("Close")}
              className="rounded-md border border-gray-300 bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              Close
            </button>

            <button
              onClick={() => handleApiCall("Assign")}
              className="rounded-md px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: colors.primary }}
            >
              Assign to ASC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
