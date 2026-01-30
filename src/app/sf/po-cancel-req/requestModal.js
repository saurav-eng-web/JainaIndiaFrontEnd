import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function RequestModal({ payload, onClose }) {
  const [remarks, setRemarks] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }
    const data = { ...payload, remarks, type: "POCancelRequest" };

    try {
      const res = await axiosInstance.post("cancellation-requests/request", data);
      if (
        res?.data?.statusCode === 200 &&
        res?.data?.statusMsg === "Records updated" &&
        res?.data?.data.length > 0
      ) {
        toast.success("Request submitted successfully");
        onClose();
      }
    } catch (error) {
      console.error("unable to submit the request for cancellation");
      toast.error("unable to submit the request for cancellation");
    }
  }
  return (
    <ModalSkeleton title={"Request for cancellation"} size="sm">
      <form className="min-w-xs space-y-4 pt-4" onSubmit={(e) => handleSubmit(e)}>
        <InputField
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
          name={"reason"}
          placeholder={"Please enter remarks"}
          required
          label={"Remakrs"}
        />
        <div className="flex justify-end">
          <Button className="">Submit Request</Button>
        </div>
      </form>
    </ModalSkeleton>
  );
}
