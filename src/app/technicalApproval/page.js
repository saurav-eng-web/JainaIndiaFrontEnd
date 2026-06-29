"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import SideBar from "@/components/SideBar";
import PageSkeleton from "@/components/customui/PageSkeleton";
import { useTheme } from "@/theme/ThemeContext";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

  const user = reduxUser || localUser;
  const userID = user?.userID;
  const roleID = user?.roleID;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "technical approval":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userID || !roleID) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `CallRegister/getstatus/Technical Approval/Not Assigned/${roleID}/${userID}`
        );
        setComplaints(response.data || []);
      } catch (err) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userID, roleID]);

  const columns = [
    {
      label: "Update",
      key: "update",
      size: "sm",
      render: (_, row) => (
        <button
          onClick={() => {
            localStorage.setItem("selectedComplaint", JSON.stringify(row));
            router.push("/assigntoasc");
          }}
          className="cursor-pointer rounded-md px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          Update
        </button>
      ),
    },
    {
      label: "Complaint No.",
      key: "tickeT_NO",
      size: "md",
    },
    {
      label: "Customer Name",
      key: "customerName",
      size: "lg",
      render: (_, row) =>
        `${row.salutation || ""} ${row.firstname || ""} ${row.lastname || ""}`,
    },
    {
      label: "Product",
      key: "product",
      size: "md",
    },
    {
      label: "Call Type",
      key: "calL_TYPE",
      size: "sm",
    },
    {
      label: "Status",
      key: "complainT_STATUS",
      size: "sm",
      render: (status) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>
      ),
    },
    {
      label: "Sub Status",
      key: "complainT_SUBSTATUS",
      size: "md",
    },
  ];

  // Technical Approval Listing
  return (
    <PageSkeleton title="Technical Approval Listing" rolesAllowed={["cc"]}>
      {loading ? (
        <p className="text-sm text-gray-600">Loading complaints...</p>
      ) : (
        <Table columns={columns} rows={complaints} />
      )}
    </PageSkeleton>
  );
}

// bg-[#f4f6f8]
