"use client";
import { useState } from "react";

import CustomDropdown from "@/components/common/Dropdown";
import InputWithLabel from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
const options = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
export default function CancelReqModal() {
  const [remarks, setRemarks] = useState("");
  return (
    <ModalSkeleton title={"Request for Cancellation"} rolesAllowed={["sf/ssd"]} size="sm">
      {/* <CustomDropdown options={options} /> */}
      <div className="min-w-xs">
        <InputWithLabel label={"Remarks"} />
      </div>
    </ModalSkeleton>
  );
}
