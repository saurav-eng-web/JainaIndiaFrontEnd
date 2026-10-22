"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/customui/button";
import ImagePreview from "@/components/customui/image/ImagePreview";
import ImageUpload from "@/components/customui/image/ImageUpload";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import RadioOption from "@/components/customui/RadioOption";
import { UploadProgressModal } from "@/components/customui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

// Label the attachments carry in the documents service
const DOCUMENT_TYPE = "ELS Document";
const MAX_FILES = 5;

// TODO: confirm the real option sources with the backend team
const ISSUE_OPTIONS = [
  { label: "Installation", value: "Installation" },
  { label: "Demo", value: "Demo" },
  { label: "Repeat", value: "Repeat" },
];

const STATUS_OPTIONS = [
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Pending", value: "Pending" },
];

// Keys match the JSON_VALUE paths the SP reads - these are case-sensitive
const ACCESSORIES = [
  { key: "PANEL_TV", label: "PANEL TV" },
  { key: "GLASS", label: "GLASS" },
  { key: "WALLMOUNT", label: "WALL MOUNT" },
  { key: "REMOTE", label: "REMOTE" },
  { key: "STAND", label: "STAND" },
  { key: "BATTERY", label: "BATTERY" },
  { key: "POWERCODE", label: "POWER CODE" },
  { key: "AV_CODE", label: "AV CABLE" },
  { key: "SCREW", label: "SCREW" },
  { key: "IR_KEY", label: "IR/KEY" },
  { key: "T_CON", label: "T-CON" },
  { key: "FFC", label: "FFC" },
  { key: "SPEAKER", label: "SPEAKER" },
  { key: "BOARD", label: "BOARD" },
];

function defaultAccessories() {
  return ACCESSORIES.reduce((acc, item) => ({ ...acc, [item.key]: "Yes" }), {});
}

export default function ElsModal({ detail, onClose, onSaved }) {
  const user = useSelector((state) => state.auth.user);

  const [issue, setIssue] = useState("Installation");
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("");
  const [boxSrNo, setBoxSrNo] = useState("");
  const [ocPcbSrNo, setOcPcbSrNo] = useState("");
  const [problemRemark, setProblemRemark] = useState("");
  const [accessories, setAccessories] = useState(defaultAccessories);
  const [isSaving, setIsSaving] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  // Object URLs are only valid until revoked - clean them up with the modal
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.src));
  }, [previews]);

  function setAccessory(key, value) {
    setAccessories((prev) => ({ ...prev, [key]: value }));
  }

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

  function handleRemoveImage(index) {
    URL.revokeObjectURL(previews[index]?.src);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!status) {
      toast.error("Please select a Status");
      return;
    }

    // Every key below matches a JSON_VALUE path in the SP's UPDATE branch exactly
    const payload = {
      action: "UPDATE",
      SerialNumber: detail?.serialNo,
      ticketno: detail?.ticketNo,
      BOX_SR_NO: boxSrNo,
      OC_PCB_SR_NO: ocPcbSrNo,
      Issue_Reported_In_Service: issue,
      Problem: problem,
      Problem_Remarks: problemRemark,
      STATUS: status,
      ModifiedBy: user?.userName || "",
      ...accessories,
    };

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

      const res = await axiosInstance.post("TDDOAPickup/process", payload);
      const body = res.data || {};
      const statusMsg = String(body.statusMsg || "");

      if (body.statusCode !== 200) {
        toast.error(statusMsg || "Failed to update DOA details");
        return;
      }

      toast.success(statusMsg || "Updated Successfully");
      onSaved?.(detail);
      onClose?.();
    } catch (error) {
      console.error("Error updating DOA details:", error);
      toast.error(error?.response?.data?.statusMsg || "Failed to update DOA details");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  }

  return (
    <ModalSkeleton title="Update DOA Details" rolesAllowed={["repaircenter"]} size="xl">
      <div className="grid grid-cols-3 gap-6">
        <CustomDropdown
          label="Issue Reported In Service"
          placeholder="Select Issue"
          options={ISSUE_OPTIONS}
          value={issue}
          onChange={setIssue}
        />

        <InputField
          label="Problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <CustomDropdown
          label="Status"
          placeholder="Select Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          required
        />

        <InputField
          label="BOX SR NO"
          value={boxSrNo}
          onChange={(e) => setBoxSrNo(e.target.value)}
        />

        <InputField
          label="OC PCB SR NO"
          value={ocPcbSrNo}
          onChange={(e) => setOcPcbSrNo(e.target.value)}
        />

        <InputField
          label="Problem Remark"
          value={problemRemark}
          onChange={(e) => setProblemRemark(e.target.value)}
        />
      </div>

      <div className="my-8 border-t border-gray-200" />

      <div className="grid grid-cols-3 gap-x-6 gap-y-6">
        {ACCESSORIES.map((item) => (
          <div key={item.key}>
            <p className="mb-2 text-sm font-semibold text-[#714b67]">{item.label}</p>

            <div className="flex items-center gap-6">
              <RadioOption
                name={item.key}
                value="Yes"
                label="Yes"
                checked={accessories[item.key] === "Yes"}
                onChange={() => setAccessory(item.key, "Yes")}
                color="text-green-700"
              />

              <RadioOption
                name={item.key}
                value="No"
                label="No"
                checked={accessories[item.key] === "No"}
                onChange={() => setAccessory(item.key, "No")}
                color="text-red-700"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="my-8 border-t border-gray-200" />

      {/* Attachments */}
      <div className="max-w-md">
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
          <ImagePreview images={previews} onRemove={handleRemoveImage} />
        )}
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <Button onClick={handleSave} disabled={isSaving || isUploading}>
          {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
        </Button>

        <Button variant="outline" onClick={onClose} disabled={isSaving || isUploading}>
          Cancel
        </Button>
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
