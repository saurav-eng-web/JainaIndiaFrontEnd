"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function SCAPopup({ ticketNo, onClose }) {
  const [jobAction, setJobAction] = useState("");
  const [symptom, setSymptom] = useState("");
  const [cause, setCause] = useState("");
  const [analysis, setAnalysis] = useState("");

  const symptomOptions = [
    { label: "No Power", value: "NO_POWER" },
    { label: "Display Issue", value: "DISPLAY" },
  ];

  const causeOptions = [
    { label: "PCB Faulty", value: "PCB" },
    { label: "Panel Damaged", value: "PANEL" },
  ];

  const analysisOptions = [
    { label: "Short Circuit", value: "SHORT" },
    { label: "Over Voltage", value: "OVERVOLT" },
  ];

  const handleSubmit = async () => {
    if (!jobAction || !symptom || !cause || !analysis) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      ticketNo,
      jobAction,
      symptom,
      cause,
      analysis,
    };

    console.log("SC Payload:", payload);
    toast.success("SC Saved Successfully");
    onClose?.();
  };

  return (
    <ModalSkeleton title="SC" size="lg">
      <div className="flex min-h-full flex-col justify-center">
        <div className="grid min-w-xl grid-cols-2 items-center gap-6">
          <InputField
            label="Job Action"
            value={jobAction}
            onChange={(e) => setJobAction(e.target.value)}
            required
          />

          <CustomDropdown
            label="Symptom"
            value={symptom}
            onChange={setSymptom}
            options={symptomOptions}
            placeholder="Select Symptom"
            required
          />

          <CustomDropdown
            label="Cause"
            value={cause}
            onChange={setCause}
            options={causeOptions}
            placeholder="Select Cause"
            required
          />

          <CustomDropdown
            label="Analysis"
            value={analysis}
            onChange={setAnalysis}
            options={analysisOptions}
            placeholder="Select Analysis"
            required
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
