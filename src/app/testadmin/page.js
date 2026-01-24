"use client";
import React, { useState } from "react";

import SCAPopup from "../sf/action/sca";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

/**
 * Main Page Component
 */

const JobStatusPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-red-400 p-20">
      <Button onClick={() => setOpen(true)} className="mb-4">
        SCA Popup
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="SCA Details">
        <SCAPopup ticketNo="TKT-9205" onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
};

export default JobStatusPage;
