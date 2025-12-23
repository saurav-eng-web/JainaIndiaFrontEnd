"use client";

import "react-responsive-modal/styles.css";
import { useState } from "react";

import SpeicalApprovalPopup from "../nsp/special-approval/specialAllowancePopup";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

const Temp = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center">
      {/* <div className="h-12 w-28 cursor-pointer rounded-xl bg-red-500! p-4">hi there</div> */}
      <Button className="mb-4 w-32" onClick={onOpenModal}>
        Open Modal
      </Button>
      <Modal open={open} onClose={onCloseModal} center>
        <SpeicalApprovalPopup />
      </Modal>
    </div>
  );
};

export default Temp;
