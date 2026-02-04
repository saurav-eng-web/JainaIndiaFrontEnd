import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ModalSkeleton from "@/components/ui/ModalSkeleton";

export default function DOATDModal({ title, type, ticketNo, onClose }) {
  const [DOATDData, setDOATDData] = useState({});
  console.log("passed data:", { type, ticketNo });

  async function handleDOATD() {
    // const title = type === "DOAcheck" ? "Doa" :
    // const titles = {
    //   DOAcheck: "DOA Request Submitted",
    //   specialDOAcheck: "Special Doa Request Submitted",
    //   TDcheck: "TD Request Submitted",
    // };

    // const title = titles[type] || "";
    try {
      const res = await axiosInstance.post("po-validation/validate", {
        type: type,
        ticket_no: ticketNo,
      });

      if (res.data.statusCode === 200 && res.data.data.length > 0) {
        // setDOATDData({
        //   title,
        //   message: res.data.statusMsg,
        //   type: "success",
        // });
        toast.success(res.data.statusMsg);
      } else {
        // setDOATDData({
        //   message: "",
        //   title: res.data.statusMsg,
        //   type: "failure",
        // });
        toast.error(res.data.statusMsg);
      }
    } catch (err) {
      console.error("Error fetching engineer data:", err);
      toast.error("Failed to submit request");
    }
  }
  return (
    <ModalSkeleton title={title} size="xl">
      <div className="min-w-2xl">hi there</div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDOATD}>Submit</Button>
      </div>
    </ModalSkeleton>
  );
}
