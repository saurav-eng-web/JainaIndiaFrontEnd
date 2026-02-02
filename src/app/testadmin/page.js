"use client";
import { useState } from "react";

import CancelReqModal from "../history/actionsModals/CancelReqModal";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageSkeleton title="Test Admin">
      <Button onClick={() => setShowModal(true)}>test</Button>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <CancelReqModal />
      </Modal>
    </PageSkeleton>
  );
}
