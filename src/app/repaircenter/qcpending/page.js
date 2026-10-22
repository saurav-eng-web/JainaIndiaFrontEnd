"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import UpdateModal from "./UpdateModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { formatApiDate } from "@/utils/pickupUtils";

// Maps the columns returned by the backend action
function mapQCPendingRow(row) {
  return {
    ticketNo: row.ticketno || row.TicketNo || "",
    serialNo: row.SerialNumber || row.serialNumber || "",
    partRequestedRemark: row.RepairedRemark || row.repairedRemark || "-",
    partRequestedPartCode: row.PartRequestedPartCode || row.partRequestedPartCode || "-",
    partRequestedBy: row.ModifiedBy || row.modifiedBy || "-",
    partRequestedDate: formatApiDate(row.RepairedDate || row.repairedDate),
  };
}

export default function RepairCenterQCPendingPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateDetail, setUpdateDetail] = useState(null);

  const fetchQCPendingCalls = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "qcpendinglist",
      });

      const data = res.data?.data || res.data?.Data || [];
      setRows(data.map(mapQCPendingRow));
    } catch (error) {
      console.error("Error loading QC Pending list:", error);
      toast.error("Failed to load call list");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQCPendingCalls();
  }, [fetchQCPendingCalls]);

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
      { label: "Updated By", key: "partRequestedBy", size: "sm" },
      { label: "Date", key: "partRequestedDate", size: "sm" },
      {
        label: "Action",
        key: "update",
        size: "sm",
        render: (_data, row) => (
          <button
            type="button"
            onClick={() => setUpdateDetail(row)}
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
    <PageSkeleton title="QC Pending Part Calls" rolesAllowed={["repaircenter"]}>
      <div className="flex items-center justify-between gap-4">
        <Subheading title="Calls" />

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-500">{rows.length} call(s)</span>

          <button
            type="button"
            onClick={fetchQCPendingCalls}
            disabled={isLoading}
            className="cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <Table columns={columns} rows={rows} isLoading={isLoading} />

      <Modal open={Boolean(updateDetail)} onClose={() => setUpdateDetail(null)}>
        <UpdateModal
          detail={updateDetail}
          onSaved={fetchQCPendingCalls}
          onClose={() => setUpdateDetail(null)}
        />
      </Modal>
    </PageSkeleton>
  );
}
