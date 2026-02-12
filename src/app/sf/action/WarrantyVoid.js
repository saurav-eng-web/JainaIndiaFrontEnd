import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function WarrantyVoidPopup({ ticketNo, onClose }) {
  const [remarks, setRemarks] = useState("");
  async function handleSubmit() {
    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    try {
      const res = await axiosInstance.post("sflevel1/process", {
        type: "Under Warranty Void",
        ticket_no: ticketNo,
        warranty: "Under Warranty Void",
        warrantyId: "6",
        remarks,
      });

      if (res.data.statusCode === 200 && res.data?.data.length > 0) {
        toast.success("Request submitted successfully");
        onClose();
      }
    } catch (error) {
      toast.error("Unable to submit the request, please try again");
    }
  }

  return (
    <ModalSkeleton title={"Mark Under Warranty Void"} size="md">
      <div className="min-w-md space-y-6">
        {/* <p>Are you sure you want to mark this part under warranty void?</p>
         */}
        <p className="font-semibold">
          Ticket No: <span className="font-normal">{ticketNo}</span>
        </p>
        <InputWithLabel
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          label="Remarks"
          className=""
        />
        <Button onClick={handleSubmit} className="ml-auto">
          Submit
        </Button>
      </div>
    </ModalSkeleton>
  );
}
