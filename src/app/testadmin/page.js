"use client";

import { useState } from "react";

import ReceiveFGPO from "../sf/action/ReceiveFGPO";
import PartConsume from "../sf/action/PartConsume";

import PageSkeleton from "@/components/ui/PageSkeleton";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

export default function TestComponent() {
  const [isOpen, setIsopen] = useState(false);
  return (
    <PageSkeleton title={"test page"}>
      <Button onClick={() => setIsopen(true)}>Open</Button>
      <Modal open={isOpen} onClose={() => setIsopen(false)}>
        <PartConsume />
      </Modal>
    </PageSkeleton>
  );
}
