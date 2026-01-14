"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { getUserFromLocalStorage } from "../../../redux/slices/authSlice";
import { setRouteData } from "../../../redux/slices/routeDataSlice";

import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";
import SectionHeading from "@/components/common/SectionHeading";
import axiosInstance from "@/api/axiosInstance";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Table from "@/components/common/Table";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

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
        userId,
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

  const columns = [
    {
      label: "Action",
      key: "action",
      size: "sm",
      render: (_value, row) => (
        <button
          onClick={() => {
            // Store ticket number in Redux before navigation
            dispatch(setRouteData({ key: "claimApproveTicket", data: row.ticket_no }));
            router.push(`/nsp/claim-approve/details`);
          }}
          className="cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          Update
        </button>
      ),
    },
    {
      label: "Ticket No",
      key: "ticket_no",
      size: "md",
    },
    {
      label: "ASC Name",
      key: "ASC_NAME",
      size: "xl",
    },
    {
      label: "Call Type",
      key: "callType",
      size: "sm",
    },
    {
      label: "Serial No",
      key: "serialNo",
      size: "md",
    },
    {
      label: "Finance Remarks",
      key: "FinanceRemarks",
      size: "xl",
      render: (value) => value || "-",
    },
  ];

  // <ProtectedRoute allowedRoles={["BR", "NSP"]}> Reject Claims call
  return (
    <PageSkeleton title="Reject Claims Calls" rolesAllowed={["BR", "NSP"]}>
      {loading ? (
        <p className="text-gray-500">Loading complaints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-md">
          <Table columns={columns} rows={complaints} />
        </div>
      )}
    </PageSkeleton>
  );
}
