"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import SerialCheckModal from "./SerialCheckModal";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import Modal from "@/components/customui/Modal";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import PickupStatusTable from "@/components/pickup/PickupStatusTable";
import { exportToExcel } from "@/utils/exportToExcel";
import { buildPickupExport, formatApiDate, mapPickupRequest } from "@/utils/pickupUtils";

export default function DoaPickupPage() {
  const [serialNo, setSerialNo] = useState("");
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [openSerialCheckPopup, setOpenSerialCheckPopup] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        Action: "DISTSELECT",
      });

      const body = res.data || {};
      const rows = body.data || body.Data || [];
      setRequests(rows.map(mapPickupRequest));
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
      toast.error("Failed to load pickup requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Exports every column DISTSELECT returns, not just the ones the table renders
  async function handleExcelDownload() {
    try {
      setIsExporting(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        Action: "DISTSELECT",
      });

      const body = res.data || {};
      const rows = body.data || body.Data || [];

      if (rows.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const { headers, data } = buildPickupExport(rows);

      exportToExcel({
        data,
        headers,
        fileName: `TD-DOA-CN-Pickup-${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: "Pickup Status",
      });

      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Error exporting pickup requests:", error);
      toast.error("Failed to export Excel");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleSubmit() {
    const serial = serialNo.trim().toUpperCase();

    if (!serial) {
      toast.error("Please enter Serial Number");
      return;
    }

    if (requests.some((r) => r.serialNo === serial)) {
      toast.error("Pickup request already exists for this serial number");
      return;
    }

    try {
      setIsChecking(true);

      const res = await axiosInstance.post("CheckSerialNo/CheckSerial", {
        SerialNo: serial,
        Type: "tdcndoaserialcheck",
      });

      // Top level is camelCase, but the SP column names inside data are preserved as-is
      const body = res.data || {};
      const record = (body.data || body.Data || [])[0] || {};
      const statusMsg = String(body.statusMsg || body.StatusMsg || "");
      const isValid = statusMsg.trim().toLowerCase().startsWith("valid");
      const invoiceDate = record.InvoiceDate || record.invoiceDate;

      setCheckResult({
        serialNo: serial,
        isValid,
        message: record.message || record.Message || statusMsg,
        invoiceDate: formatApiDate(invoiceDate),
      });
      setOpenSerialCheckPopup(true);
    } catch (error) {
      console.error("Error checking serial number:", error);
      toast.error("Failed to validate serial number");
    } finally {
      setIsChecking(false);
    }
  }

  async function handleRequestPickup() {
    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        SerialNumber: checkResult.serialNo,
        Action: "INSERT",
      });

      const body = res.data || {};
      const statusCode = body.statusCode || body.StatusCode;
      const statusMsg = String(body.statusMsg || body.StatusMsg || "");

      if (statusCode !== 200) {
        toast.error(statusMsg || "Failed to submit pickup request");
        return;
      }

      toast.success(statusMsg || "Request submitted successfully");

      setOpenSerialCheckPopup(false);
      setCheckResult(null);
      setSerialNo("");

      await fetchRequests();
    } catch (error) {
      console.error("Error submitting pickup request:", error);
      toast.error("Failed to submit pickup request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageSkeleton title="TD / DOA / CN Pickup Request" rolesAllowed={["distributor"]}>
      <Subheading title="Raise a request" />

      <div className="flex flex-wrap items-start gap-6">
        <InputField
          type="text"
          label="Serial Number"
          placeholder="Enter Serial Number"
          className="w-xs"
          value={serialNo}
          onChange={(e) => setSerialNo(e.target.value)}
          onEnterKeyPressed={handleSubmit}
        />

        <Button className="mt-6" onClick={handleSubmit} disabled={isChecking}>
          {isChecking ? "Checking..." : "Submit Request"}
        </Button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <Subheading title="Pickup Status Tracking" />

          <Button
            variant="outline"
            onClick={handleExcelDownload}
            disabled={isLoading || isExporting}
          >
            {isExporting ? "Preparing..." : "Export to Excel"}
          </Button>
        </div>

        <PickupStatusTable rows={requests} isLoading={isLoading} />
      </div>

      <Modal open={openSerialCheckPopup} onClose={() => setOpenSerialCheckPopup(false)}>
        <SerialCheckModal
          serialNo={checkResult?.serialNo}
          invoiceDate={checkResult?.invoiceDate}
          message={checkResult?.message}
          isValid={checkResult?.isValid}
          isSubmitting={isSubmitting}
          onRequestPickup={handleRequestPickup}
        />
      </Modal>
    </PageSkeleton>
  );
}
