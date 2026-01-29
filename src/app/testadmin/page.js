"use client";
import React, { useState } from "react";

import SCAPopup from "../sf/action/sca";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";

/**
 * Main Page Component
 */

const JobStatusPage = () => {
  const [open, setOpen] = useState(false);
  async function loadDate() {
    try {
      const res = await axiosInstance.post("cancellation/request", {
        type: "POCancel",
      });
      console.log("res: ", res);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const s =
    "SHOP NO 6 JAY HANUMAN CHAYA BILD DAWADI ROAD DOMBIVALI EAST\nMumbai\nMaharashtra-421203";

  const str = '"""LED Panel UHD 43"""""""';

  return (
    <PageSkeleton title="Test">
      <div className="min-h-2xl min-w-2xl bg-red-400 p-20">
        <Button onClick={() => setOpen(true)} className="mb-4">
          SCA Popup
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="SCA Details">
          <SCAPopup ticketNo="TKT-9205" onClose={() => setOpen(false)} />
        </Modal>
      </div>
      <p>{str.trim()}</p>
      <Button onClick={loadDate}>load</Button>
    </PageSkeleton>
  );
};

export default JobStatusPage;
