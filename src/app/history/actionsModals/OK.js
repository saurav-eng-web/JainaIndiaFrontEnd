import { on } from "events";

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
    if (!happyCode || happyCode.length !== 4) {
      toast.error("Please enter a valid 4-digit happy code");
      return;
    }

    const payload = {
      TicketNo: ticketNo,
      Pin: happyCode,
    };

    try {
      const res = await toast.promise(
        axiosInstance.post("happycode-job-close-check/validate", payload),
        {
          loading: "Validating happy code...",
          success: (res) => {
            if (
              res.data.statusCode === 200 &&
              res.data.statusMsg === "Valid Happy Code"
            ) {
              setValidHappyCode(true);
              return "Happy code is valid";
            } else {
              setValidHappyCode(false);
              throw new Error("Invalid happy code");
            }
          },
          error: (err) =>
            err?.response?.data?.statusMsg ||
            err.message ||
            "Unable to verify happy code. Please try again.",
        }
      );

      return res;
    } catch (error) {
      // already handled by toast.promise
      console.error("API Error:", error);
    }
  };

  // const handleValidateHappycode = async () => {
  //   if (!happyCode || happyCode.length !== 4) {
  //     toast.error("Please enter a valid 4-digit happy code");
  //     return;
  //   }

  //   const payload = {
  //     TicketNo: ticketNo,
  //     Pin: happyCode,
  //   };

  //   try {
  //     const res = await axiosInstance.post("happycode-job-close-check/validate", payload);
  //     if (res.data.statusCode === 200 && res.data.statusMsg === "Valid Happy Code") {
  //       toast.success("Happy code is valid");
  //       setValidHappyCode(true);
  //     } else {
  //       toast.error("Invalid happy code");
  //       setValidHappyCode(false);
  //     }
  //   } catch (error) {
  //     toast.error("Unable to verify validate happy code! Please try again.");
  //     console.error("API Error:", error);
  //   }
  // };

  const handleUpload = async () => {
    try {
      if (!images || images.length === 0) return true;

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

    if (isSubmitting) return;

    const payload = {
      type: "okcheck",
      ticket_no: ticketNo,
    };

    // We use a manual loading toast so we can precisely control
    // when to show Success vs Error based on your API's logic.
    const toastId = toast.loading("Submitting request...");

    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("ok-call/process", payload);
      const apiData = res.data;
      const firstItem = apiData?.data?.[0];

      // 1. Check for the specific "OK" success condition
      if (
        apiData.statusCode === 200 &&
        firstItem?.COMPLAINT_STATUS === "OK" &&
        firstItem?.Complaint_SubStatus === "OK"
      ) {
        // Handle images if any
        if (images.length > 0) {
          const uploadSuccess = await handleUpload();
          if (!uploadSuccess) {
            toast.error("Some images failed to upload");
          }
        }

        toast.success("Call closed successfully", { id: toastId });
        onClose();
        router.back();
      }
      // 2. Handle Business Logic Errors (Status 200 but data says failed)
      else {
        const errorMsg = apiData.statusMsg || "Validation failed";
        toast.error(errorMsg, { id: toastId });
        onClose();
      }
    } catch (error) {
      // 3. Handle actual Network/Server Errors (400, 500)
      const errorMsg =
        error?.response?.data?.statusMsg ||
        error.message ||
        "Something went wrong while closing the call";

      toast.error(errorMsg, { id: toastId });
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async () => {
  //   if (!validHappyCode) {
  //     toast.error("Please validate happy code.");
  //     return;
  //   }

  //   if (isSubmitting) return;

  //   const payload = {
  //     type: "okcheck",
  //     ticket_no: ticketNo,
  //     // happyCode: happyCode,
  //     // remarks: remarks,
  //   };

  //   try {
  //     setIsSubmitting(true);

  //     const resp = await toast.promise(axiosInstance.post("ok-call/process", payload), {
  //       loading: "Submitting request...",
  //       success: async (res) => {
  //         console.log("res: ", res);
  //         if (res.data.statusCode === 200 && res.data?.data.length > 0) {
  //           console.log("inside data.leng if");
  //           if (
  //             res.data.data[0].COMPLAINT_STATUS === "OK" &&
  //             res.data.data[0].Complaint_SubStatus === "OK"
  //           ) {
  //             console.log("inside ok status");

  //             if (images.length > 0) {
  //               const uploadSuccess = await handleUpload();
  //               if (!uploadSuccess) {
  //                 toast.error("Some images failed to upload");
  //               }
  //             }
  //             toast.success("Call closed successfully");
  //             router.back();
  //           } else {
  //             console.log("inside else");
  //             // this not shown
  //             toast.error(res.data.statusMsg);
  //             onClose();
  //           }
  //         }
  //         console.log("without if");
  //         onClose();
  //         throw new Error(res.data.statusMsg || "Failed to close call");
  //       },
  //       error: (err) =>
  //         err?.response?.data?.statusMsg ||
  //         err.message ||
  //         "Something went wrong while closing the call",
  //     });
  //   } catch (error) {
  //     // Already handled by toast.promise
  //     console.error("API Error:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

  // const isUploadDisabled = !validHappyCode;

  // TODO: Valid serial no
  return (
    <ModalSkeleton title={"Call Closure"} rolesAllowed={["sf/ssd"]} size="xl">
      <div className="space-y-6">
        <div className="grid w-2xl grid-cols-2 gap-6">
          <div>
            <InputField
              label={"Happy Code"}
              type={"number"}
              onChange={(e) => setHappyCode(e.target.value)}
              required={true}
            />
            <Button
              variant={validHappyCode ? "verified" : "primary"}
              disabled={validHappyCode}
              onClick={handleValidateHappycode}
              className="mt-4"
            >
              {validHappyCode ? "Verified" : "Verify"}
            </Button>
          </div>

          <InputField
            label={"Remarks"}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            message={"Optional"}
          />
        </div>
        <div>
          <ImageUpload
            label={"Upload Image"}
            variant="box"
            multiple
            onChange={(e) => handleImageSelect(e)}
            value={images}
            message={"(Optional)"}
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
