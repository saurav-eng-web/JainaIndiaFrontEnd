"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

// Outcomes the doatdrec action can return
const OUTCOME_STYLES = {
  200: { label: "Received", pill: "bg-green-100 text-green-700" },
  409: { label: "Already Received", pill: "bg-amber-100 text-amber-700" },
  404: { label: "Not Found", pill: "bg-red-100 text-red-700" },
  400: { label: "Not Valid", pill: "bg-red-100 text-red-700" },
};

function outcomeFor(statusCode) {
  return (
    OUTCOME_STYLES[statusCode] || { label: "Failed", pill: "bg-gray-100 text-gray-600" }
  );
}

const OUTCOME_COLUMN = {
  label: "Result",
  key: "statusCode",
  size: "md",
  render: (statusCode) => {
    const outcome = outcomeFor(statusCode);
    return (
      <span
        className={`-ml-2 inline-block rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${outcome.pill}`}
      >
        {outcome.label}
      </span>
    );
  },
};

export default function RepairCenterReceivePage() {
  const [serialNo, setSerialNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scans, setScans] = useState([]);
  const [elsDetail, setElsDetail] = useState(null);
  const serialInputRef = useRef(null);

  // Pulls ticket / model / received date for a serial that was just received
  async function fetchReceivedDetail(serial) {
    try {
      const res = await axiosInstance.post("TDDOAPickup/process", {
        SerialNumber: serial,
        action: "RECEIVED",
      });

      const row = (res.data?.data || res.data?.Data || [])[0] || {};

      return {
        ticketNo: row.ticketno || row.TicketNo || "",
        model: row.Model || row.model || "",
        recDate: formatApiDate(row.rec_date || row.Rec_date || row.recDate),
      };
    } catch (error) {
      console.error("Error fetching received detail:", error);
      return { ticketNo: "", model: "", recDate: "" };
    }
  }

  // Keep the box focused so a barcode scanner types straight into it
  useEffect(() => {
    serialInputRef.current?.focus();
  }, []);

  function focusSerialInput() {
    setTimeout(() => serialInputRef.current?.focus(), 50);
  }

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
      const statusCode = body.statusCode;
      const statusMsg = String(body.statusMsg || "");

      // Only a fresh receive has detail worth pulling back
      const detail =
        statusCode === 200
          ? await fetchReceivedDetail(serial)
          : { ticketNo: "", model: "", recDate: "" };

      if (statusCode === 200) {
        toast.success(statusMsg || "Received Successfully");
      } else {
        toast.error(statusMsg || "Not valid for receive");
      }

      setScans((prev) => [
        {
          serialNo: serial,
          statusCode,
          message: statusMsg,
          time: new Date().toLocaleTimeString(),
          ...detail,
        },
        ...prev,
      ]);

      setSerialNo("");
    } catch (error) {
      console.error("Error receiving serial number:", error);

      const body = error?.response?.data;
      const statusMsg = String(body?.statusMsg || "Failed to receive serial number");

      toast.error(statusMsg);

      setScans((prev) => [
        {
          serialNo: serial,
          statusCode: body?.statusCode,
          message: statusMsg,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } finally {
      setIsSubmitting(false);
      focusSerialInput();
    }
  }

  const receivedCount = scans.filter((scan) => scan.statusCode === 200).length;

  // ELS is only meaningful for a unit that was actually received
  const scanColumns = useMemo(
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
      OUTCOME_COLUMN,
      { label: "Message", key: "message", size: "xl" },
      { label: "Time", key: "time", size: "sm" },
      {
        label: "ELS",
        key: "els",
        size: "sm",
        render: (_data, row) =>
          row.statusCode === 200 ? (
            <button
              type="button"
              onClick={() => setElsDetail(row)}
              className="-ml-2 cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white"
            >
              ELS
            </button>
          ) : (
            <span className="text-gray-400">-</span>
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

      {scans.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <Subheading title="This session" />

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-gray-500">
                {receivedCount} received of {scans.length} scanned
              </span>

              <button
                type="button"
                onClick={() => {
                  setScans([]);
                  focusSerialInput();
                }}
                className="cursor-pointer rounded-full border border-[#714b67] px-3 py-1 text-xs font-semibold text-[#714b67] transition-colors duration-300 hover:bg-[#714b67] hover:text-white"
              >
                Clear list
              </button>
            </div>
          </div>

          <Table columns={scanColumns} rows={scans} />
        </div>
      )}

      <Modal
        open={Boolean(elsDetail)}
        onClose={() => {
          setElsDetail(null);
          focusSerialInput();
        }}
      >
        <ElsModal
          detail={elsDetail}
          onClose={() => {
            setElsDetail(null);
            focusSerialInput();
          }}
        />
      </Modal>
    </PageSkeleton>
  );
}
