"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/ui/InputWithLabel";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <PageSkeleton title="Test Admin" rolesAllowed={["sf/ssd"]}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <TestModal />
      </Modal>
    </PageSkeleton>
  );
}

function TestModal() {
  const [remarks, setRemarks] = useState("");
  return (
    <ModalSkeleton>
      <InputWithLabel
        label="Test"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </ModalSkeleton>
  );
}
