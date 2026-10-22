"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ReceiveModal from "./ReceiveModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { formatApiDate } from "@/utils/pickupUtils";

// Maps the columns returned by the backend action
function mapPartApprovedRow(row) {
  return {
    ticketNo: row.ticketno || row.TicketNo || "",
    serialNo: row.SerialNumber || row.serialNumber || "",
    partRequestedRemark: row.PartRequestedRemark || row.partRequestedRemark || "-",
    partRequestedPartCode: row.PartRequestedPartCode || row.partRequestedPartCode || "-",
    partRequestedBy: row.PartRequestedBy || row.partRequestedBy || "-",
    partRequestedDate: formatApiDate(row.PartRequestedDate || row.partRequestedDate),
  };
}

export default function RepairCenterPartApprovedPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [receiveDetail, setReceiveDetail] = useState(null);

  const fetchPartApprovedCalls = useCallback(async () => {
    try {
      setIsLoading(true);

      // Note: Ensure that 'partapprovedlist' action is configured in your backend SP
      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "partapprovedlist",
      });

      const data = res.data?.data || res.data?.Data || [];
      setRows(data.map(mapPartApprovedRow));
    } catch (error) {
      console.error("Error loading Part Approved list:", error);
      toast.error("Failed to load call list");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartApprovedCalls();
  }, [fetchPartApprovedCalls]);

  const columns = useMemo(
    () => [
      {
        label: "S.No",
        key: "sno",
        size: "xxs",
        render: (_data, _row, rowIndex) => rowIndex + 1,
      },
      { label: "Ticket No", key: "ticketNo", size: "sm" },
      { label: "Serial Number", key: "serialNo", size: "md" },
      {
        label: "Part Code",
        key: "partRequestedPartCode",
        size: "lg",
        render: (data) => {
          if (!data || data === "-") return "-";
          const parts = data.split(",");
          return (
            <div className="flex flex-col space-y-1 py-1">
              {parts.map((p, i) => (
                <span key={i}>
                  {i + 1}. {p.trim()}
                </span>
              ))}
            </div>
          );
        },
      },
      { label: "Remark", key: "partRequestedRemark", size: "md" },
      { label: "Requested By", key: "partRequestedBy", size: "sm" },
      { label: "Requested Date", key: "partRequestedDate", size: "sm" },
      {
        label: "Action",
        key: "receive",
        size: "sm",
        render: (_data, row) => (
          <button
            type="button"
            onClick={() => setReceiveDetail(row)}
            className="-ml-2 cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white"
          >
            Update
          </button>
        ),
      },
    ],
    []
  );

  return (
    <PageSkeleton title="ELS Part Approved Calls" rolesAllowed={["repaircenter"]}>
      <div className="flex items-center justify-between gap-4">
        <Subheading title="Calls" />

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-500">{rows.length} call(s)</span>

          <button
            type="button"
            onClick={fetchPartApprovedCalls}
            disabled={isLoading}
            className="cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <Table columns={columns} rows={rows} isLoading={isLoading} />

      <Modal open={Boolean(receiveDetail)} onClose={() => setReceiveDetail(null)}>
        <ReceiveModal
          detail={receiveDetail}
          onSaved={fetchPartApprovedCalls}
          onClose={() => setReceiveDetail(null)}
        />
      </Modal>
    </PageSkeleton>
  );
}
