"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { getUserFromLocalStorage } from "../../../redux/slices/authSlice";
import { setRouteData } from "../../../redux/slices/routeDataSlice";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Loading from "@/components/customui/Loading";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { useTheme } from "@/theme/ThemeContext";

export default function ComplaintTable() {
  const tabs = ["NSP", "ASC"];

  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dasboardData, setDashboardData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [ascData, setAscData] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = getUserFromLocalStorage();
  const userId = userData?.userID;

  const filteredData = useMemo(() => {
    if (!search.trim()) return complaints;

    const query = search.toLowerCase();

    return complaints.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(query)
      )
    );
  });

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
      try {
        setStatsLoading(true);
        const payload = {
          type: "nsp",
        };
        const data = await axiosInstance.post("FinanceClaimCount/claim-counts", payload);
        if (!data?.data?.datasets) {
          toast.error("Unable to load dashboard data");
          return;
        }
        const [aData, dashData] = data.data.datasets;
        setAscData(aData?.data || []);
        setDashboardData(dashData?.data || []);
        console.log("data: ", data.data);
      } catch (err) {
        console.error("Dashboard API Error:", err);
        toast.error("Unable to load dashboard data");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchClaimData();
    fetchDashboardData();
  }, [userId]);

  const NSPColumns = [
    {
      label: "S. No",
      key: "serialNumber",
      size: "xxs",
      render: (_value, _row, rowIndex) => rowIndex + 1,
    },
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
      label: "S. No",
      key: "serialNumber",
      size: "xxs",
      render: (_value, _row, rowIndex) => rowIndex + 1,
    },
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
      label: "S. No",
      key: "serialNumber",
      size: "xxs",
      render: (_value, _row, rowIndex) => rowIndex + 1,
    },
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
        <div className="flex min-h-40 items-center justify-center rounded-md bg-white">
          <Loading label="Loading complaints" showLabel />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <Subheading title="ASC / NSP Stats" marginTop={8} />

          <div className="mb-6 overflow-x-auto rounded-md">
            <div
              className="ml-2 flex gap-1"
              role="tablist"
              aria-label="Claim summary view"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab)}
                    className={`h-8 min-w-20 cursor-pointer rounded-t-md px-8 text-sm font-semibold text-white transition-colors ${
                      isActive ? "bg-primary" : "bg-primary/70 hover:bg-primary/85"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            {activeTab === "NSP" ? (
              <Table columns={NSPColumns} rows={ascData} isLoading={statsLoading} />
            ) : (
              <Table columns={ASCColumns} rows={dasboardData} isLoading={statsLoading} />
            )}
          </div>
          <Subheading title="Rejected Calls" marginTop={8} />

          <div className="overflow-x-auto rounded-md">
            <div className="flex">
              <input
                type="text"
                placeholder="Search by complaints, call type or ASC"
                value={search}
                // className="mb-3 w-72 rounded border px-3 py-2 text-sm focus:outline-none"
                className="focus:border-primary border-primary focus:ring-primary mb-6 h-11 w-72 rounded-lg border-2 bg-white px-3 py-2 transition-all outline-none focus:ring-1"
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="ml-3 flex h-11 items-center justify-center text-sm text-gray-500">
                showing {filteredData.length} complaints
              </p>
            </div>
            <Table columns={columns} rows={filteredData} />
          </div>
        </>
      )}
    </PageSkeleton>
  );
}
