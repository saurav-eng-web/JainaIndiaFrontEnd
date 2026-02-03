"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import CancelReqModal from "../history/actionsModals/CancelReqModal";
import DOATDPopup from "../history/actionsModals/DOATD";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmationModal";
import DatePicker from "@/components/ui/Datepicker";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import StatusModal from "@/components/ui/StatusModal";
import TimePicker from "@/components/ui/timepicker";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState("");
  console.log("time: ", time);
  const [visitDate, setVisitDate] = useState("");

  return (
    <PageSkeleton title="Test Admin">
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => toast.success("test")}>success</Button>
        <Button onClick={() => toast.error("test")}>failure</Button>
        <Button onClick={() => setShowModal(true)}>open</Button>
        <DatePicker
          label="Visit Date"
          value={visitDate}
          onChange={setVisitDate}
          required
        />
        <TimePicker label="Visit Time" value={time} onChange={setTime} />
      </div>
      {/* <ConfirmModal
        open={showModal}
        onConfirm={() => setShowModal(false)}
        title={"DOA Check"}
        message={"Requested Accepted"}
        type="Submit"
      /> */}
      <StatusModal
        open={showModal}
        type="success" // failure
        title="Request Submitted"
        message="Your request has been processed successfully."
        onClose={() => setShowModal(false)}
      />
      ;
    </PageSkeleton>
  );
}

//  <Modal open={showModal} onClose={() => setShowModal(false)}>
//    {/* <CancelReqModal /> */}
//    <DOATDPopup />
//  </Modal>;
