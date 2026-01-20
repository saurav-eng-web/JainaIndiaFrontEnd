import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/ImageUpload";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import axiosInstance from "@/api/axiosInstance";
// import TextArea from "@/components/ui/Textarea";

// status, substatus =  doa approved

export default function DOAClosure({ ticketNo }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [validSerial, setValidSerial] = useState(false);
  const [happyCode, setHappyCode] = useState(false);
  const [validHappyCode, setValidHappyCode] = useState(false);
  const [images, setImages] = useState([]);
  const [remarks, setRemarks] = useState("");
  const router = useRouter();
  async function hanldeSerialCheck() {
    if (!serialNumber) {
      return;
    }

    try {
      const payload = {
        serialNo: serialNumber,
        ticketNo: ticketNo,
        pincode: 0,
        type: "DOASerialNo",
      };
      const res = await axiosInstance.put("CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";

      if (message === "Valid serial no") {
        router.back();
      }
      console.log("res: ", res);
    } catch (error) {
      console.error("Error serial check:", error);
      toast.error("Failed to validate serial number. Please try again.");
    }
  }
  const handleValidateHappycode = async () => {
    if (!happyCode) {
      return;
    }

    const payload = {
      // temp
    };

    try {
      const res = await axiosInstance.post("endpoint", payload);

      console.log("res: ", res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("API Error:", error);
    }
  };
  function handleImageUpload() {}
 

   // TODO: Valid serial no
  return (
    <ModalSkeleton title={"DOA Closure"} rolesAllowed={["sf/ssd"]} size="xl">
      <div className="grid w-2xl grid-cols-2 gap-6">
        <InputField
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          label={"New Serial No."}
          type={"text"}
          required={true}
          onBlur={hanldeSerialCheck}
        />
        <InputField
          label={"Happy Code"}
          type={"text"}
          required={true}
          disabled={!validSerial}
        />

        <ImageUpload label={"Image"} multiple disabled={!validSerial} />
        <InputField label={"Remarks"} required={true} />
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <Button variant="simple">Back</Button>
        <Button>Submit</Button>
      </div>
    </ModalSkeleton>
  );
}
