"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import InputField from "@/components/ui/InputWithLabel";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { UploadProgressModal } from "@/components/ui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

export default function GasChargingReqModal({ ticketNo, onClose }) {
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const MAX_VIDEOS = 1;
  const MAX_VIDEO_SIZE_MB = 30;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const existingVideos = files.filter((f) => f.type.startsWith("video/"));
    const newVideos = [];
    const errorMessages = [];

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("video/")) {
        errorMessages.push(`File "${file.name}" is not a valid video`);
        return;
      }

      if (existingVideos.length + newVideos.length >= MAX_VIDEOS) {
        errorMessages.push(
          `Maximum ${MAX_VIDEOS} video allowed (you already have ${existingVideos.length})`
        );
        return;
      }

      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        errorMessages.push(`Video "${file.name}" exceeds ${MAX_VIDEO_SIZE_MB}MB limit`);
        return;
      }

      newVideos.push(file);
    });

    if (errorMessages.length > 0) {
      errorMessages.forEach((msg) => toast.error(msg));
    }

    if (newVideos.length > 0) {
      setFiles((prev) => [...prev, ...newVideos]);
    }
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      setUploadProgress(0);
      setIsUploading(true);

      const result = await uploadImage({
        files: files,
        ticketNo: ticketNo,
        documentType: "Gas Charging Image-Video",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });

      if (!result.success) {
        toast.error("File upload failed. Please try again.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
    }
  };

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select a video");
      return;
    }

    if (!remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("gas-charging/process", {
        type: "GCRequest",
        ticket_no: ticketNo,
        remarks: remarks,
      });

      const data = res.data;

      if (
        data?.statusCode === 200 &&
        data?.statusMsg === "Record found Successfully" &&
        data.count > 0
      ) {
        const uploadSuccess = await handleUpload();
        if (uploadSuccess) {
          toast.success("Gas Charging Request submitted successfully");
          router.back();
        } else {
          toast.error("Gas Charging Request created, but file upload failed.");
        }
      } else {
        toast.error(data?.statusMsg || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting gas charging request:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalSkeleton title="Gas Charging Request" size="lg" rolesAllowed={["sf/ssd"]}>
      <UploadProgressModal
        open={isUploading}
        title="Uploading Video"
        progress={uploadProgress}
        fileInfo={currentFileInfo}
      />
      <div className="min-w-xl space-y-6">
        <div className="w-full min-w-xl space-y-4">
          <ImageUpload
            variant="box"
            onChange={handleFileChange}
            multiple={false}
            accept="video/*"
            label="Upload video"
            maxFileAllowed={MAX_VIDEOS}
            maxFileSize={MAX_VIDEO_SIZE_MB}
          />

          {files.length > 0 && (
            <div className="h-14 px-2">
              <ImagePreview
                images={files.map(() => ({ type: "video" }))}
                onRemove={handleRemove}
                size={"14"}
              />
            </div>
          )}
        </div>

        <InputField
          label="Remarks"
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onClose()} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || isUploading}>
          {isUploading ? "Uploading..." : isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
