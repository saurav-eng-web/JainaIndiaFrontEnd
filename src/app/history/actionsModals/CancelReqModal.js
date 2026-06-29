"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/customui/button";
import InputWithLabel from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";

export default function CancelReqModal({
  ticketNo,
  complaintSubStatus,
  ipAddress,
  onClose,
}) {
  const [remarks, setRemarks] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitCancelRequest() {
    if (!selectedReason) {
      toast.error("Please select a cancel reason");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    const apiCall = axiosInstance.post("cancellation-requests/request", {
      type: "JobCancelRequest",
      ticket_no: ticketNo,
      reason: selectedReason,
      remarks,
      complaint_substatus: complaintSubStatus,
      ip_address: ipAddress,
    });

    toast.promise(apiCall, {
      loading: "Submitting cancellation request...",
      success: (res) => {
        if (res.data.statusCode === 200 && res.data.data.length > 0) {
          onClose();
          return "Request submitted successfully";
        }

        throw new Error(res.data.statusMsg || "Unable to submit request");
      },
      error: (err) => {
        console.error("Error submitting cancel request:", err);
        return "Failed to submit cancel request, try again";
      },
    });
  }

  const cancelOptions = useMemo(
    () => [
      {
        label: "Not required service / complaint cancel by customer",
        value: "Not required service / complaint cancel by customer",
      },
      {
        label: "Customer not responding/ number not reachable or switched off",
        value: "Customer not responding/ number not reachable or switched off",
      },
      {
        label: "Customer donot have bill or document",
        value: "Customer donot have bill or document",
      },
      { label: "Customer out of station", value: "Customer out of station" },
      { label: "Duplicate complaints", value: "Duplicate complaints" },
      {
        label: "Damage / Defective product",
        value: "Damage / Defective product",
      },
      {
        label: "Not repairable at home, so visit at shop",
        value: "Not repairable at home, so visit at shop",
      },
      {
        label: "Customer went to dealer shop for service",
        value: "Customer went to dealer shop for service",
      },
      {
        label: "Not ready to pay for spare/service",
        value: "Not ready to pay for spare/service",
      },
      {
        label: "Product is not repairable",
        value: "Product is not repairable",
      },
      {
        label: "Customer didnot register the complaint",
        value: "Customer didnot register the complaint",
      },
      { label: "Wrong address", value: "Wrong address" },
      { label: "Wrong contact number", value: "Wrong contact number" },
      {
        label: "Old product, Spare not available",
        value: "Old product, Spare not available",
      },
      {
        label: "Replacement / unavailability of product",
        value: "Replacement / unavailability of product",
      },
      { label: "Sales Enquiry", value: "Sales Enquiry" },
      {
        label: "Call resolved over phone.",
        value: "Call resolved over phone.",
      },
      {
        label: "Unit working fine, no visit required.",
        value: "Unit working fine, no visit required.",
      },
      { label: "Others", value: "Others" },
    ],
    []
  );
  return (
    <ModalSkeleton title={"Request for Cancellation"} rolesAllowed={["sf/ssd"]} size="lg">
      {/* <div className="grid w-xl grid-cols-2 gap-4"> */}
      <div className="flex w-lg flex-col gap-6">
        <CustomDropdown
          options={cancelOptions}
          label={"Select Reason"}
          value={selectedReason}
          onChange={(value) => setSelectedReason(value)}
          placeholder="Select Cancel Reason"
          required
        />
        <InputWithLabel
          label={"Remarks"}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
        />
      </div>
      <Button
        disabled={submitting}
        className="mt-8 ml-auto"
        onClick={submitCancelRequest}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </ModalSkeleton>
  );
}
