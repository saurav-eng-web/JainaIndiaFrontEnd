import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function PaidWarrantyReqModal({ data, onClose }) {
  const [remarks, setRemarks] = useState("");

  async function submitData() {
    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }
    // const
    await toast.promise(
      axiosInstance.post("paid-warranty/process", {
        ...data,
        type: "PaidPartRequest",
        remarks,
      }),
      {
        loading: "Submitting Request...",
        success: (res) => {
          toast.success("Request submitted successfully");
          onClose();
          console.log("res: ", res);
        },
        error: () => {
          toast.error("Failed to submit, try again!");
          return null;
        },
      }
    );
  }
  return (
    <ModalSkeleton title={"Paid Warranty Request"} rolesAllowed={["sf/ssd"]} size="lg">
      <div className="min-w-sm space-y-6">
        <InputField
          label={"Serial No."}
          placeholder={"Enter Remarks"}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button className="ml-auto" onClick={submitData}>
          Submit
        </Button>
      </div>
    </ModalSkeleton>
  );
}
