"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import TextArea from "@/components/customui/Textarea";

export default function UpdateModal({ detail, onClose, onSaved }) {
  const [isSaving, setIsSaving] = useState(false);
  const [qcStatus, setQcStatus] = useState("");
  const [qcRemarks, setQcRemarks] = useState("");

  async function handleSubmit() {
    if (!qcStatus) {
      toast.error("Please select a QC Status.");
      return;
    }
    if (!qcRemarks.trim()) {
      toast.error("Please enter QC Remarks.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        action: "update_qc_status",
        SerialNumber: detail?.serialNo,
        ticketno: detail?.ticketNo,
        QCStatus: qcStatus,
        QCRemarks: qcRemarks,
      };

      const res = await axiosInstance.post("TDDOAPickup/process", payload);

      const body = res.data || {};
      const statusMsg = String(body.statusMsg || "");

      if (body.statusCode !== 200 && body.statusCode !== 1) {
        toast.error(statusMsg || "Failed to update QC status");
        return;
      }

      toast.success(statusMsg || "QC Status Updated Successfully");
      onSaved?.(detail);
      onClose?.();
    } catch (error) {
      console.error("Error updating QC record:", error);
      toast.error(
        error?.response?.data?.statusMsg || "Something went wrong while updating QC"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ModalSkeleton title="Update QC Status" rolesAllowed={["repaircenter"]} size="lg">
      <div className="w-[36rem]">
        {/* Read Only Information */}
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Ticket No" value={detail?.ticketNo || "-"} disabled />
          <InputField label="Serial Number" value={detail?.serialNo || "-"} disabled />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <InputField
            label="Part Code"
            value={detail?.partRequestedPartCode || "-"}
            disabled
          />
          <InputField
            label="Repaired Remarks"
            value={detail?.partRequestedRemark || "-"}
            disabled
          />
        </div>

        {/* QC Inputs */}
        <div className="mt-6">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            QC Status <span className="text-red-500">*</span>
          </label>
          <select
            value={qcStatus}
            onChange={(e) => setQcStatus(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67] focus:outline-none"
          >
            <option value="">-- Select QC Status --</option>
            <option value="QC Pass">QC Pass</option>
            <option value="QC Fail">QC Fail</option>
          </select>
        </div>

        <div className="mt-6">
          <TextArea
            label="QC Remarks"
            placeholder="Enter QC remarks here"
            value={qcRemarks}
            onChange={(e) => setQcRemarks(e.target.value)}
            required
          />
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit"}
          </Button>

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
