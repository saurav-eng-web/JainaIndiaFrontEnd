"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import RadioOption from "@/components/customui/RadioOption";

// TODO: confirm the real option sources with the backend team
const ISSUE_OPTIONS = [
  { label: "Installation", value: "Installation" },
  { label: "Demo", value: "Demo" },
  { label: "Repeat", value: "Repeat" },
];

const STATUS_OPTIONS = [
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Pending", value: "Pending" },
];

// Accessory checklist - every item is a Yes / No pair
const ACCESSORIES = [
  { key: "wallMount", label: "WALL MOUNT" },
  { key: "remote", label: "REMOTE" },
  { key: "stand", label: "STAND" },
  { key: "battery", label: "BATTERY" },
  { key: "powerCode", label: "POWER CODE" },
  { key: "avCable", label: "AV CABLE" },
  { key: "screw", label: "SCREW" },
  { key: "irKey", label: "IR/KEY" },
  { key: "tCon", label: "T-CON" },
  { key: "ffc", label: "FFC" },
  { key: "speaker", label: "SPEAKER" },
  { key: "board", label: "BOARD" },
];

function defaultAccessories() {
  return ACCESSORIES.reduce((acc, item) => ({ ...acc, [item.key]: "Yes" }), {});
}

export default function ElsModal({ detail, onClose }) {
  const [issue, setIssue] = useState("Installation");
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("");
  const [boxSrNo, setBoxSrNo] = useState("");
  const [ocPcbSrNo, setOcPcbSrNo] = useState("");
  const [problemRemark, setProblemRemark] = useState("");
  const [accessories, setAccessories] = useState(defaultAccessories);
  const [isSaving, setIsSaving] = useState(false);

  function setAccessory(key, value) {
    setAccessories((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!status) {
      toast.error("Please select a Status");
      return;
    }

    const payload = {
      SerialNumber: detail?.serialNo,
      ticketNo: detail?.ticketNo,
      issueReportedInService: issue,
      problem,
      status,
      boxSrNo,
      ocPcbSrNo,
      problemRemark,
      ...accessories,
    };

    // TODO: the save action for this modal has not been provided yet
    console.log("ELS payload ready to submit:", payload);
    setIsSaving(true);
    toast.error("Save endpoint not configured yet");
    setIsSaving(false);
  }

  return (
    <ModalSkeleton title="Update DOA Details" rolesAllowed={["repaircenter"]} size="xl">
      <div className="grid grid-cols-3 gap-6">
        <CustomDropdown
          label="Issue Reported In Service"
          placeholder="Select Issue"
          options={ISSUE_OPTIONS}
          value={issue}
          onChange={setIssue}
        />

        <InputField
          label="Problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <CustomDropdown
          label="Status"
          placeholder="Select Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          required
        />

        <InputField
          label="BOX SR NO"
          value={boxSrNo}
          onChange={(e) => setBoxSrNo(e.target.value)}
        />

        <InputField
          label="OC PCB SR NO"
          value={ocPcbSrNo}
          onChange={(e) => setOcPcbSrNo(e.target.value)}
        />

        <InputField
          label="Problem Remark"
          value={problemRemark}
          onChange={(e) => setProblemRemark(e.target.value)}
        />
      </div>

      <div className="my-8 border-t border-gray-200" />

      <div className="grid grid-cols-3 gap-x-6 gap-y-6">
        {ACCESSORIES.map((item) => (
          <div key={item.key}>
            <p className="mb-2 text-sm font-semibold text-[#714b67]">{item.label}</p>

            <div className="flex items-center gap-6">
              <RadioOption
                name={item.key}
                value="Yes"
                label="Yes"
                checked={accessories[item.key] === "Yes"}
                onChange={() => setAccessory(item.key, "Yes")}
                color="text-green-700"
              />

              <RadioOption
                name={item.key}
                value="No"
                label="No"
                checked={accessories[item.key] === "No"}
                onChange={() => setAccessory(item.key, "No")}
                color="text-red-700"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </ModalSkeleton>
  );
}
