"use client";
import { useState } from "react";

import CancelReqModal from "../history/actionsModals/CancelReqModal";
import DOATDPopup from "../history/actionsModals/DOATD";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/Datepicker";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import TimePicker from "@/components/ui/timepicker";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState("");
  console.log("time: ", time);
  const [visitDate, setVisitDate] = useState("");

  return (
    <PageSkeleton title="Test Admin">
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => setShowModal(true)}>test</Button>
        <DatePicker
          label="Visit Date"
          value={visitDate}
          onChange={setVisitDate}
          required
        />
        <TimePicker label="Visit Time" value={time} onChange={setTime} />
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        {/* <CancelReqModal /> */}
        <DOATDPopup />
      </Modal>
    </PageSkeleton>
  );
}
