"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { getUserFromLocalStorage } from "../../../redux/slices/authSlice";
import { setRouteData } from "../../../redux/slices/routeDataSlice";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { useTheme } from "@/theme/ThemeContext";

export default function ComplaintTable() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dasboardData, setDashboardData] = useState([]);
  const [activeTab, setActiveTab] = useState("ASC");
  const [ascData, setAscData] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

  const tabs = ["NSP", "ASC"];

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

    const fetchDashboardData = async () => {
      const payload = {
        type: "nsp",
      };
      const data = await axiosInstance.post("FinanceClaimCount/claim-counts", payload);
      if (!data?.data?.datasets) {
        toast.error("Unable to load dashboard data");
        return;
      }
      const [aData, dashData] = data.data.datasets;
      setAscData(aData?.data);
      setDashboardData(dashData?.data);
      console.log("data: ", data.data);
    };

    fetchClaimData();
    fetchDashboardData();
  }, [userId]);

  const NSPColumns = [
    {
      label: "NSP",
      key: "NSP",
      size: "lg",
    },
    {
      label: "Pending for approval",
      key: "PendingForApproval",
      size: "sm",
    },

    {
      label: "Resubmit for claim",
      key: "ReSubmitForClaim",
      size: "sm",
    },
    {
      label: "Pending at asc nsp",
      key: "PendingAtAscNsp",
      size: "sm",
    },
    {
      label: "Claim Hold",
      key: "ClaimHold",
      size: "sm",
    },
    {
      label: "Claim Approve",
      key: "ClaimApprove",
      size: "sm",
    },
    {
      label: "Claim Rejected",
      key: "ClaimRejected",
      size: "sm",
    },
  ];

  const ASCColumns = [
    {
      label: "ASC",
      key: "ASC_NAME",
      size: "lg",
    },
    {
      label: "ASC CODE",
      key: "ASC_CODE",
      size: "sm",
    },

    {
      label: "Resubmit for claim",
      key: "ReSubmitForClaim",
      size: "sm",
    },
    {
      label: "Pending at ASC",
      key: "PendingAtAsc",
      size: "sm",
    },
    {
      label: "Total Pending",
      key: "TotalPending",
      size: "sm",
    },
  ];

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
      label: "ASC Code",
      key: "ASC_CODE",
      size: "sm",
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
    <PageSkeleton title="Rejected Claim Calls" rolesAllowed={["BR", "NSP", "SF/SSD"]}>
      {loading ? (
        <p className="text-gray-500">Loading complaints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-6 overflow-x-auto rounded-md">
            <div className="ml-2 flex">
              <p className="ml bg-primary text-lg">test</p>
              <button
                className={`bg-primary h-8 cursor-pointer rounded-t-md px-6 text-white ${activeTab === "ASC" ? "bg-gray-800 " : ""}`}
                onClick={() => setActiveTab("ASC")}
              >
                ASC
              </button>
              <button
                onClick={() => setActiveTab("ASC")}
                className={`h-8 cursor-pointer rounded-t-md bg-gray-600 px-6 text-white ${activeTab === "NSP" ? "bg-gray-800 " : ""}`}
              >
                NSP
              </button>
            </div>
            {ascData.length > 0 ? (
              activeTab === "NSP" ? (
                <Table columns={NSPColumns} rows={ascData} />
              ) : (
                <Table columns={ASCColumns} rows={dasboardData} />
              )
            ) : (
              <span>Loading</span>
            )}
          </div>
          <div className="overflow-x-auto rounded-md">
            <Table columns={columns} rows={complaints} />
          </div>
        </>
      )}
    </PageSkeleton>
  );
}
