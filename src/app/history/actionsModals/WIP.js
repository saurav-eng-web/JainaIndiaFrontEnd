import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { updateJob } from "@/utils/commonApis";
import { logger } from "@/utils/logger";
import { uploadImage } from "@/utils/uploadImage";

export default function WIPPopupModal({ ticketNo, onClose, pinCode }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [serialFile, setSerialFile] = useState([]);
  const [serialPreview, setSerialPreview] = useState([]);
  const [invoiceFile, setInvoiceFile] = useState([]);
  const [invoicePreview, setInvoicePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validSerial, setValidSerial] = useState(false);
  const imageUploaded = serialFile.length > 0 && invoiceFile.length > 0;

  const MAX_SIZE_MB = 5;
  //   const MAX_FILES = 5;

  useEffect(() => {
    if (!serialFile || serialFile.length === 0) {
      setSerialPreview([]);
      return;
    }

    const newPreviews = serialFile.map((file) => URL.createObjectURL(file));
    setSerialPreview(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [serialFile]);

  useEffect(() => {
    if (!invoiceFile || invoiceFile.length === 0) {
      setInvoicePreview([]);
      return;
    }

    const newPreviews = invoiceFile.map((file) => URL.createObjectURL(file));
    setInvoicePreview(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [invoiceFile]);

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files || []);
    const files = type === "serial" ? serialFile : invoiceFile;
    const setFiles = type === "serial" ? setSerialFile : setInvoiceFile;
    const MAX_FILES = type === "serial" ? 3 : 1;

    // Total count validation
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    // Size validation (per file)
    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(`Each image must be less than ${MAX_SIZE_MB} MB`);
      return;
    }

    // All validations passed
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveSerialImages = (index) => {
    setSerialFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveInvoiceImages = (index) => {
    setInvoiceFile((prev) => prev.filter((_, i) => i !== index));
  };

  const validateSerialNumber = async () => {
    if (!serialNumber) {
      toast.error("Please enter serial number");
      return false;
    }

    try {
      const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", {
        serialNo: serialNumber,
        ticketNo: ticketNo,
        pincode: pinCode,
        type: "simpcheck",
      });
      if (res.data.statusCode === 200 && res.data.statusMsg === "Valid serial no") {
        setValidSerial(true);
        toast.success("Serial number is valid");
      } else {
        toast.error(res.data.message || "Invalid serial number");
      }
    } catch (error) {
      toast.error("Error validating serial number");
      console.error("Error validating serial number:", error);
    }
  };

  async function handleSubmit() {
    if (!imageUploaded) {
      toast.error("Please upload both images");
      return;
    }
    if (!validSerial) {
      toast.error("Please validate serial number");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        serialNo: serialNumber,
        ticketNo: ticketNo,
        pincode: pinCode,
        type: "WIPProcess",
      };

      const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";
      const parts = message.split("|");

      if (parts.length < 2) {
        throw new Error(message || "Invalid response format from server");
      }

      const [status, subStatus, responseMessage] = parts.map((s) => s?.trim());

      const [serialRes, invoiceRes] = await Promise.all([
        uploadImage({
          files: serialFile,
          documentType: "Serial Document",
          ticketNo,
        }),
        uploadImage({
          files: invoiceFile,
          documentType: "Invoice Document",
          ticketNo,
        }),
      ]);

      if (!serialRes.success) {
        logger.error("Failed to upload Serial Number image", "WIP submission", {
          payload,
        });
        throw new Error("Failed to upload Serial Number image");
      }
      if (!invoiceRes.success) {
        logger.error("Failed to upload Invoice image", "WIP submission", {
          payload,
        });
        throw new Error("Failed to upload Invoice image");
      }

      logger.info(`Serial check success: ${status}|${subStatus}`, "WIP submission", {
        payload,
      });
      toast.success("Submitted successfully");
      onClose();
    } catch (error) {
      const displayMsg =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during submission";

      logger.error(`Submission Error: ${displayMsg}`, "WIP submission");
      toast.error(displayMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  //   async function handleSubmit() {
  //     if (!imageUploaded) {
  //       toast.error("Please upload both images");
  //       return;
  //     }
  //     if (!serialNumber) {
  //       toast.error("Please enter serial number");
  //       return;
  //     }

  //     const uplaodSerialImagePromise = uploadImage({
  //       file: serialFile,
  //       documentType: "Serial Document",
  //       ticketNo,
  //     });
  //     const uploadInvoiceImagePromise = uploadImage({
  //       file: invoiceFile,
  //       documentType: "Invoice Document",
  //       ticketNo,
  //     });

  //     try {
  //       setIsSubmitting(true);
  //       const [serialRes, invoiceRes] = await Promise.all([
  //         uplaodSerialImagePromise,
  //         uploadInvoiceImagePromise,
  //       ]);

  //       if (!serialRes.success) {
  //         toast.error("Failed to upload Serial Number images");
  //         return;
  //       }
  //       if (!invoiceRes.success) {
  //         toast.error("Failed to upload Invoice images");
  //         return;
  //       }
  //     } catch (error) {
  //       logger.error(`Error during WIP submission: ${error.message}`, "WIP submission");
  //       toast.error("An error occurred while uploading images");
  //     } finally {
  //       setIsSubmitting(false);
  //     }

  //     const payload = {
  //       serialNo: serialNumber,
  //       ticketNo: ticketNo,
  //       pincode: pinCode,
  //       type: "WIPProcess",
  //     };
  //     try {
  //       setIsSubmitting(true);
  //       const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
  //       const message = res?.data?.message?.trim() || "";
  //       const parts = message.split("|");
  //       const hasStatus = parts.length >= 2;

  //       if (!hasStatus) {
  //         toast.error(message);
  //         return;
  //       }

  //       const status = parts[0]?.trim();
  //       const subStatus = parts[1]?.trim();
  //       const responseMessage = parts[2]?.trim() || "";

  //       await updateJob(status, subStatus, responseMessage, serialNumber);
  //       logger.info(`Serial check: ${status}|${subStatus}`, "serial check WIP", {
  //         payload,
  //       });
  //       onClose();
  //     } catch (error) {
  //       logger.error(`Error serial check: ${error.message}`, "serial check WIP");
  //       toast.error("Error validating serial number");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }

  //   const handleSerialCheck = async () => {
  //     const payload = {
  //       serialNo: serialNumber,
  //       ticketNo: ticketNo,
  //       pincode: pinCode,
  //       type: "WIPProcess",
  //     };
  //     try {
  //       const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
  //       const message = res?.data?.message?.trim() || "";
  //       const parts = message.split("|");
  //       const hasStatus = parts.length >= 2;

  //       if (!hasStatus) {
  //         toast.error(message);
  //         return;
  //       }

  //       const status = parts[0]?.trim();
  //       const subStatus = parts[1]?.trim();
  //       const responseMessage = parts[2]?.trim() || "";

  //       await updateJob(status, subStatus, responseMessage, serialNumber);
  //       logger.info(`Serial check: ${status}|${subStatus}`, "serial check WIP", {
  //         payload,
  //       });
  //       onClose();
  //     } catch (error) {
  //       logger.error(`Error serial check: ${error.message}`, "serial check WIP");
  //       toast.error("Error validating serial number");
  //     }
  //   };

  return (
    <ModalSkeleton title={"WIP"} size={"xl"} rolesAllowed={["sf/ssd"]}>
      <div className="min-w-xl space-y-6">
        <p className="font-semibold">
          Ticket Number: <span className="ml-4 text-gray-700">{ticketNo}</span>
        </p>

        <div className="flex gap-4">
          <div>
            <ImageUpload
              variant="box"
              onChange={(e) => handleFileChange(e, "invoice")}
              multiple={true}
              label={"Invoice No Doc"}
              maxFileAllowed={"1"}
              maxFileSize={"5"}
            />
            {invoicePreview.length > 0 && (
              <div className="flex h-14 justify-center px-2">
                <ImagePreview
                  images={invoicePreview}
                  onRemove={handleRemoveInvoiceImages}
                />
              </div>
            )}
          </div>
          <div>
            <ImageUpload
              variant="box"
              onChange={(e) => handleFileChange(e, "serial")}
              multiple={true}
              label={"Serial No Doc"}
              maxFileAllowed={"3"}
              maxFileSize={"5"}
            />

            {serialPreview.length > 0 && (
              <div className="flex h-14 justify-center px-2">
                <ImagePreview
                  images={serialPreview}
                  onRemove={handleRemoveSerialImages}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Serial Number"
            type="text"
            className={"grid-cols-1 pr-1"}
            placeholder="Enter Serial Number"
            value={serialNumber}
            onChange={(e) => {
              setValidSerial(false);
              setSerialNumber(e.target.value);
            }}
            disabled={!imageUploaded}
            message={imageUploaded ? "" : "Please upload images first"}
            required
          />
          <Button
            disabled={validSerial || !serialNumber}
            onClick={validateSerialNumber}
            variant="outline"
            className="mt-6 w-32"
          >
            {validSerial ? "Validated" : "Validate Serial"}
            {validSerial && "✅"}
          </Button>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
}
