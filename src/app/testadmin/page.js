"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";

// import ReceiveFGPO from "../sf/action/ReceiveFGPO";
// import PartConsume from "../sf/action/PartConsume";
import MSLConsume from "../sf/action/MSLConsume";
import DOAClosure from "../sf/action/DOAClosure";

import Bucket from "./bucket";
import DOAClosureTest from "./test";

import PageSkeleton from "@/components/ui/PageSkeleton";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

export default function TestComponent() {
  const [isOpen, setIsopen] = useState(false);
  const [isOpenD, setIsopenD] = useState(false);

  const [isOpenR, setIsopenR] = useState(false);

  // const router = useRouter();
  return (
    <PageSkeleton title={"test page"}>
      <div className="flex gap-6">
        <Button onClick={() => setIsopen(true)}>MSL</Button>
        <Button onClick={() => setIsopenD(true)}>DOA</Button>
        <Button onClick={() => setIsopenR(true)}>Open</Button>
        <Button onClick={() => setIsopenR(true)}>Open</Button>
      </div>

      <DOAClosureTest />

      {isOpenR && <Bucket />}
      <Modal open={isOpen} onClose={() => setIsopen(false)}>
        <MSLConsume />
      </Modal>

      <Modal open={isOpenD} onClose={() => setIsopenD(false)}>
        <DOAClosure />
      </Modal>
    </PageSkeleton>
  );
}
