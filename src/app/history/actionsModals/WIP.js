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

export default function WIPPopupModal({ ticketNo, onClose, pinCode }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [serialFile, setSerialFile] = useState([]);
  const [serialPreview, setSerialPreview] = useState([]);
  const [invoiceFile, setInvoiceFile] = useState([]);
  const [invoicePreview, setInvoicePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageUploaded = serialFile && invoiceFile;

  const MAX_SIZE_MB = 5;
  const MAX_FILES = 5;

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

  async function handleSubmit() {
    if (!imageUploaded) {
      toast.error("Please upload both images before submitting.");
      return;
    }
    if (!serialNumber) {
      toast.error("Please enter serial number");
      return;
    }
    console.log("test");

    const payload = {
      serialNo: serialNumber,
      ticketNo: ticketNo,
      pincode: pinCode,
      type: "WIPProcess",
    };
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";
      const parts = message.split("|");
      const hasStatus = parts.length >= 2;

      if (!hasStatus) {
        toast.error(message);
        return;
      }

      const status = parts[0]?.trim();
      const subStatus = parts[1]?.trim();
      const responseMessage = parts[2]?.trim() || "";

      await updateJob(status, subStatus, responseMessage, serialNumber);
      logger.info(`Serial check: ${status}|${subStatus}`, "serial check WIP", {
        payload,
      });
      onClose();
    } catch (error) {
      logger.error(`Error serial check: ${error.message}`, "serial check WIP");
      toast.error("Error validating serial number");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files || []);
    const files = type === "serial" ? serialFile : invoiceFile;
    const setFiles = type === "serial" ? setSerialFile : setInvoiceFile;

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

  const handleRemoveSerialImages = (index, type) => {
    setSerialFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveInvoiceImages = (index, type) => {
    setInvoiceFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSerialCheck = async () => {
    const payload = {
      serialNo: serialNumber,
      ticketNo: ticketNo,
      pincode: pinCode,
      type: "WIPProcess",
    };
    try {
      const res = await axiosInstance.post("/CheckSerialNo/CheckSerial", payload);
      const message = res?.data?.message?.trim() || "";
      const parts = message.split("|");
      const hasStatus = parts.length >= 2;

      if (!hasStatus) {
        toast.error(message);
        return;
      }

      const status = parts[0]?.trim();
      const subStatus = parts[1]?.trim();
      const responseMessage = parts[2]?.trim() || "";

      await updateJob(status, subStatus, responseMessage, serialNumber);
      logger.info(`Serial check: ${status}|${subStatus}`, "serial check WIP", {
        payload,
      });
      onClose();
    } catch (error) {
      logger.error(`Error serial check: ${error.message}`, "serial check WIP");
      toast.error("Error validating serial number");
    }
  };

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
            />
            {invoicePreview.length > 0 && (
              <div className="rounded-lg border border-gray-400 bg-white p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Selected Images ({invoicePreview.length})
                </h4>
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
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          <InputField
            label="Serial Number"
            type="text"
            className={"grid-cols-1 pr-1"}
            placeholder="Enter Serial Number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            disabled={!imageUploaded}
            message={"Please upload images first"}
            required
          />
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
