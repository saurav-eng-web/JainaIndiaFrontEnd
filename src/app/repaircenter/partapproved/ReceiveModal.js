"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import ImagePreview from "@/components/customui/image/ImagePreview";
import ImageUpload from "@/components/customui/image/ImageUpload";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import TextArea from "@/components/customui/Textarea";
import { UploadProgressModal } from "@/components/customui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

// Label the attachments carry in the documents service
const DOCUMENT_TYPE = "Part Repaired Document";
const MAX_FILES = 5;

export default function ReceiveModal({ detail, onClose, onSaved }) {
  const [isSaving, setIsSaving] = useState(false);
  const [statusAction, setStatusAction] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  // Object URLs are only valid until revoked - clean them up with the modal
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.src));
  }, [previews]);

  function handleImageSelect(e) {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    if (files.length + picked.length > MAX_FILES) {
      toast.error(`You can attach at most ${MAX_FILES} images`);
      return;
    }

    setFiles((prev) => [...prev, ...picked]);
    setPreviews((prev) => [
      ...prev,
      ...picked.map((file) => ({ type: "image", src: URL.createObjectURL(file) })),
    ]);
  }

  function handleRemove(index) {
    URL.revokeObjectURL(previews[index]?.src);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!statusAction) {
      toast.error("Please select a status from the dropdown.");
      return;
    }
    if (!updateRemarks.trim()) {
      toast.error("Please enter Remarks.");
      return;
    }

    try {
      setIsSaving(true);

      // Attach the evidence first - if it fails the record is left untouched
      if (files.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);
        setCurrentFileInfo({ current: 1, total: files.length });

        const uploadRes = await uploadImage({
          files,
          ticketNo: detail?.ticketNo,
          documentType: DOCUMENT_TYPE,
          onProgress: (percent, current, total) => {
            setUploadProgress(percent);
            setCurrentFileInfo({ current, total });
          },
        });

        setIsUploading(false);

        if (!uploadRes.success) {
          toast.error("Image upload failed. Please try again.");
          return;
        }
      }

      const payload = {
        action: "update_approved_parts",
        SerialNumber: detail?.serialNo,
        ticketno: detail?.ticketNo,
        UpdateStatus: statusAction,
        UpdateRemarks: updateRemarks,
      };

      const res = await axiosInstance.post("TDDOAPickup/process", payload);

      const body = res.data || {};
      const statusMsg = String(body.statusMsg || "");

      if (body.statusCode !== 200 && body.statusCode !== 1) {
        toast.error(statusMsg || "Failed to update record");
        return;
      }

      toast.success(statusMsg || "Updated Successfully");
      onSaved?.(detail);
      onClose?.();
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error(
        error?.response?.data?.statusMsg || "Something went wrong while updating"
      );
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  }

  return (
    <ModalSkeleton
      title="Update Approved Parts"
      rolesAllowed={["repaircenter"]}
      size="lg"
    >
      <div className="w-[36rem]">
        {/* Read Only Information */}
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Ticket No" value={detail?.ticketNo || "-"} disabled />
          <InputField label="Serial Number" value={detail?.serialNo || "-"} disabled />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <InputField
            label="Part Code"
            value={detail?.partRequestedPartCode || "-"}
            disabled
          />
          <InputField
            label="Requested Remarks"
            value={detail?.partRequestedRemark || "-"}
            disabled
          />
        </div>

        {/* Inputs */}
        <div className="mt-6">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Action Status <span className="text-red-500">*</span>
          </label>
          <select
            id="statusSelect"
            value={statusAction}
            onChange={(e) => setStatusAction(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67] focus:outline-none"
          >
            <option value="">-- Select Status --</option>
            <option value="Part Repaired">Part Repaired</option>
          </select>
        </div>

        <div className="mt-6">
          <TextArea
            id="updateRemarks"
            label="Remarks"
            placeholder="Enter your remarks here"
            value={updateRemarks}
            onChange={(e) => setUpdateRemarks(e.target.value)}
            required
          />
        </div>

        {/* Attachments */}
        <div className="mt-6">
          <ImageUpload
            label="Attach Images"
            variant="box"
            multiple
            accept="image/*"
            maxFileAllowed={MAX_FILES}
            disabled={isUploading || isSaving}
            onChange={handleImageSelect}
            message={files.length > 0 ? `${files.length} selected` : ""}
          />

          {previews.length > 0 && (
            <ImagePreview images={previews} onRemove={handleRemove} />
          )}
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button onClick={handleSubmit} disabled={isSaving || isUploading}>
            {isUploading ? "Uploading..." : isSaving ? "Submitting..." : "Submit"}
          </Button>

          <Button variant="outline" onClick={onClose} disabled={isSaving || isUploading}>
            Cancel
          </Button>
        </div>
      </div>

      <UploadProgressModal
        open={isUploading}
        progress={uploadProgress}
        fileInfo={currentFileInfo}
        title="Uploading Images"
      />
    </ModalSkeleton>
  );
}
