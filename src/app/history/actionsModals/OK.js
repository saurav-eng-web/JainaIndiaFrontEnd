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

export default function OKPopup({ ticketNo, onClose }) {
  const [happyCode, setHappyCode] = useState("");
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
        documentType: "Call Closure",
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
    if (!validHappyCode) {
      toast.error("Please validate happy code.");
      return;
    }

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      type: "OK",
      ticket_no: ticketNo,
      happyCode: happyCode,
      remarks: remarks,
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

      console.log("res: ", res);
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

  const isUploadDisabled = !validHappyCode;

  // TODO: Valid serial no
  return (
    <ModalSkeleton title={"OK"} rolesAllowed={["sf/ssd"]} size="xl">
      <div className="space-y-6">
        <div className="grid w-2xl grid-cols-2 gap-6">
          <InputField
            label={"Happy Code"}
            type={"text"}
            onChange={(e) => setHappyCode(e.target.value)}
            required={true}
            onBlur={handleValidateHappycode}
          />

          <InputField
            label={"Remarks"}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div>
          <ImageUpload
            label={"Upload Image"}
            variant="box"
            multiple
            onChange={(e) => handleImageSelect(e)}
            value={images}
          />
          {/* Preview Section */}
          {previews.length > 0 && (
            <div className="mt-2 h-14 rounded-lg px-2">
              <ImagePreview images={previews} onRemove={handleRemoveImage} />
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button disabled={isSubmitting} onClick={() => router.back()} variant="outline">
            Back
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
