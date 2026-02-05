"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import CancelReqModal from "../history/actionsModals/CancelReqModal";
import DOATDPopup from "../history/actionsModals/DOATD";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmationModal";
import DatePicker from "@/components/ui/Datepicker";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import PageSkeleton from "@/components/ui/PageSkeleton";
import StatusModal from "@/components/ui/StatusModal";
import TimePicker from "@/components/ui/timepicker";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [popup, setPopup] = useState(false);

  return (
    <PageSkeleton title="Test Admin">
      <div className="grid grid-cols-4 gap-4">
        <Button onClick={() => setPopup(true)}>open modal</Button>
        <Button onClick={() => toast.success("test")}>success</Button>
        <Button onClick={() => toast.error("test")}>failure</Button>
        <Button onClick={() => setShowModal(true)}>open success</Button>
      </div>
      <StatusModal
        open={showModal}
        type="success" // failure
        title="Request Submitted"
        message="Your request has been processed successfully."
        onClose={() => setShowModal(false)}
      />
      <Modal open={popup} onClose={() => setPopup(false)} mode="strict">
        <TestModal onClose={() => setPopup(false)} />
      </Modal>
    </PageSkeleton>
  );
}

function TestModal({ onClose }) {
  return (
    <ModalSkeleton title={"test"} size="md">
      <div className="min-w-sm">hi there</div>
      {/* <Button className="mt-20 ml-auto" variant="outline" onClick={onClose}>
        Cancel
      </Button> */}
      <Button className="mt-20 ml-auto" variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </ModalSkeleton>
  );
}
