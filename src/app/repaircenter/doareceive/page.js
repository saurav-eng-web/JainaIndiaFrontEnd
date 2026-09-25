"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import ElsModal from "./ElsModal";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { formatApiDate } from "@/utils/pickupUtils";

// Maps the columns returned by the RECEIVED action
function mapReceivedRow(row) {
  return {
    ticketNo: row.ticketno || row.TicketNo || "",
    serialNo: row.SerialNumber || row.serialNumber || "",
    model: row.Model || row.model || "",
    recDate: formatApiDate(row.rec_date || row.Rec_date || row.recDate),
  };
}

export default function RepairCenterReceivePage() {
  const [serialNo, setSerialNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receivedRows, setReceivedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [elsDetail, setElsDetail] = useState(null);
  const serialInputRef = useRef(null);

  // Keep the box focused so a barcode scanner types straight into it
  useEffect(() => {
    serialInputRef.current?.focus();
  }, []);

  function focusSerialInput() {
    setTimeout(() => serialInputRef.current?.focus(), 50);
  }

  // Listing of received units. Omitting SerialNumber asks for the full list.
  const fetchReceived = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "RECEIVED",
      });

      const rows = res.data?.data || res.data?.Data || [];
      setReceivedRows(rows.map(mapReceivedRow));
    } catch (error) {
      console.error("Error loading received list:", error);
      toast.error("Failed to load received list");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceived();
  }, [fetchReceived]);

  async function handleReceive() {
    const serial = serialNo.trim().toUpperCase();

    if (!serial) {
      toast.error("Please enter or scan a Serial Number");
      focusSerialInput();
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        SerialNumber: serial,
        action: "doatdrec",
      });

      const body = res.data || {};
      const statusMsg = String(body.statusMsg || "");

      // Anything other than a fresh receive is a message only - no row is added
      if (body.statusCode !== 200) {
        toast.error(statusMsg || "Not valid for receive");
        return;
      }

      toast.success(statusMsg || "Received Successfully");

      setSerialNo("");

      await fetchReceived();
    } catch (error) {
      console.error("Error receiving serial number:", error);
      toast.error(error?.response?.data?.statusMsg || "Failed to receive serial number");
    } finally {
      setIsSubmitting(false);
      focusSerialInput();
    }
  }

  const columns = useMemo(
    () => [
      {
        label: "S.No",
        key: "sno",
        size: "xxs",
        render: (_data, _row, rowIndex) => rowIndex + 1,
      },
      { label: "Ticket No", key: "ticketNo", size: "md" },
      { label: "Serial Number", key: "serialNo", size: "lg" },
      { label: "Model", key: "model", size: "md" },
      { label: "Received Date", key: "recDate", size: "sm" },
      {
        label: "ELS",
        key: "els",
        size: "sm",
        render: (_data, row) => (
          <button
            type="button"
            onClick={() => setElsDetail(row)}
            className="-ml-2 cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white"
          >
            ELS
          </button>
        ),
      },
    ],
    []
  );

  return (
    <PageSkeleton title="Receive TD / DOA / CN" rolesAllowed={["repaircenter"]}>
      <Subheading title="Scan or enter serial number" />

      <div className="flex flex-wrap items-start gap-6">
        <InputField
          ref={serialInputRef}
          type="text"
          label="Serial Number"
          placeholder="Scan or type Serial Number"
          className="w-sm"
          value={serialNo}
          onChange={(e) => setSerialNo(e.target.value)}
          onEnterKeyPressed={handleReceive}
          disabled={isSubmitting}
        />

        <Button className="mt-6" onClick={handleReceive} disabled={isSubmitting}>
          {isSubmitting ? "Receiving..." : "Received"}
        </Button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        The box stays focused - scan the next unit straight after the previous one.
      </p>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <Subheading title="Pending for ELS" />

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-500">
              {receivedRows.length} pending
            </span>

            <button
              type="button"
              onClick={() => {
                fetchReceived();
                focusSerialInput();
              }}
              disabled={isLoading}
              className="cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <Table columns={columns} rows={receivedRows} isLoading={isLoading} />
      </div>

      <Modal
        open={Boolean(elsDetail)}
        onClose={() => {
          setElsDetail(null);
          focusSerialInput();
        }}
      >
        <ElsModal
          detail={elsDetail}
          onSaved={fetchReceived}
          onClose={() => {
            setElsDetail(null);
            focusSerialInput();
          }}
        />
      </Modal>
    </PageSkeleton>
  );
}
