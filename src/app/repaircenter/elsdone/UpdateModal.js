"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import PartMultiSelect from "./PartMultiSelect";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import TextArea from "@/components/customui/Textarea";

export default function UpdateModal({ detail, onClose, onSaved }) {
  const [problemRemarks, setProblemRemarks] = useState("");
  const [partCodes, setPartCodes] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Part list comes from the same endpoint with action=partload
  const fetchParts = useCallback(async () => {
    try {
      setIsLoadingParts(true);

      const res = await axiosInstance.post("TDDOAPickup/process", {
        action: "partload",
        SerialNumber: detail?.serialNo,
        ticketno: detail?.ticketNo,
      });

      const rows = res.data?.data || res.data?.Data || [];

      setPartOptions(
        rows
          .map((row) => {
            const part = row.Part ?? row.part ?? row.PartCode ?? row.partcode ?? "";
            return { label: String(part), value: String(part) };
          })
          .filter((opt) => opt.value)
      );
    } catch (error) {
      console.error("Error loading part codes:", error);
      toast.error("Failed to load part codes");
    } finally {
      setIsLoadingParts(false);
    }
  }, [detail?.serialNo, detail?.ticketNo]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  async function handleSubmit() {
    if (!problemRemarks.trim()) {
      toast.error("Please enter Problem Remarks");
      return;
    }

    if (partCodes.length === 0) {
      toast.error("Please select at least one Part Code");
      return;
    }

    const payload = {
      SerialNumber: detail?.serialNo,
      ticketno: detail?.ticketNo,
      Problem_Remarks: problemRemarks,
      PartCodes: partCodes.join(","),
    };

    // TODO: the submit action for this modal has not been provided yet
    console.log("Update payload ready to submit:", payload);
    setIsSaving(true);
    toast.error("Submit action not configured yet");
    setIsSaving(false);
    onSaved?.(detail);
  }

  return (
    <ModalSkeleton title="Update" rolesAllowed={["repaircenter"]} size="lg">
      <div className="w-[36rem]">
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Ticket No" value={detail?.ticketNo || "-"} disabled />
          <InputField label="Serial Number" value={detail?.serialNo || "-"} disabled />
        </div>

        <div className="mt-6">
          <TextArea
            label="Problem Remarks"
            placeholder="Enter problem remarks"
            value={problemRemarks}
            onChange={(e) => setProblemRemarks(e.target.value)}
            required
          />
        </div>

        <div className="mt-6">
          <PartMultiSelect
            label="Part Code"
            options={partOptions}
            value={partCodes}
            onChange={setPartCodes}
            isLoading={isLoadingParts}
            required
          />

          <p className="mt-1 text-xs text-gray-500">
            {partCodes.length > 0
              ? `${partCodes.length} part(s) selected`
              : "You can select more than one part"}
          </p>
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
