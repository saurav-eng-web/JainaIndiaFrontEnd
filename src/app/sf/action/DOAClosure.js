import axios from "axios";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { uploadImage } from "@/utils/uploadImage";
// import TextArea from "@/components/ui/Textarea";

// status, substatus =  doa approved

export default function DOAClosure({ ticketNo, oldSerialNumber, model }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [validSerial, setValidSerial] = useState(false);
  const [happyCode, setHappyCode] = useState(false);
  const [validHappyCode, setValidHappyCode] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  async function handleSerialCheck() {
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
      const res = await axiosInstance.post("CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";

      if (message === "Valid serial no") {
        // router.back();
        toast.success("Serial number is valid");
        setValidSerial(true);
      } else {
        toast.error(message);
        setValidSerial(false);
      }
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
      TicketNo: ticketNo,
      Pin: happyCode,
    };

    try {
      const res = await axiosInstance.post("happycode-job-close-check/validate", payload);
      if (res.data.statusCode === 200 && res.data.statusMsg === "Valid Happy Code") {
        toast.success("Happy code is valid");
        setValidHappyCode(true);
      } else {
        toast.error("Invalid happy code");
        setValidHappyCode(false);
      }
    } catch (error) {
      toast.error("Unable to verify validate happy code! Please try again.");
      console.error("API Error:", error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!images || images.length === 0) return true;

      // Use the generic uploadImage utility which supports multiple files
      const result = await uploadImage({
        file: images,
        ticketNo: ticketNo,
        documentType: "DOA Closure",
      });

      if (!result.success) {
        console.error("Upload failed:", result.error);
        toast.error("Failed to upload images");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Global Upload error", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validSerial || !validHappyCode) {
      toast.error("Please validate serial number and happy code.");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    if (!model || !oldSerialNumber) {
      toast.error("Please go back and try again");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      type: "DOAConsume",
      ticket_no: ticketNo,
      data: [
        {
          model,
          newSerialNumber: serialNumber,
          oldSerialNumber: oldSerialNumber,
          remarks,
        },
      ],
    };

    try {
      const res = await axiosInstance.post("consumption/process", payload);

      if (
        res.data.statusCode === 200 &&
        res.data.statusMsg === "Record Inserted/Updated Successfully" &&
        res.data?.data.length > 0
      ) {
        if (images.length > 0) {
          const uploadSuccess = await handleUpload();
          if (!uploadSuccess) {
            toast.error("Some images failed to upload");
            // Continue to close? Usually yes, but warn.
          }
        }
        toast.success("Call closed successfully");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.back();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    // Validate total count
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate each file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploadDisabled = !validSerial || !validHappyCode;

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
          onBlur={handleSerialCheck}
        />
        <InputField
          label={"Happy Code"}
          type={"text"}
          onChange={(e) => setHappyCode(e.target.value)}
          required={true}
          disabled={!validSerial}
          onBlur={handleValidateHappycode}
        />

        <ImageUpload
          label={"Image"}
          variant="input"
          multiple
          disabled={!validSerial || !validHappyCode}
          onChange={(e) => handleImageSelect(e)}
          value={images}
        />
        <InputField
          label={"Remarks"}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required={true}
        />
      </div>

      {/* Preview Section */}
      {previews.length > 0 && (
        <div className="mt-6 rounded-lg border bg-white p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">
            Selected Images ({previews.length}/5)
          </h4>
          <ImagePreview images={previews} onRemove={handleRemoveImage} />
        </div>
      )}

      <div className="mt-10 flex justify-end gap-4">
        <Button disabled={isSubmitting} onClick={() => router.back()} variant="outline">
          Back
        </Button>
        <Button disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
