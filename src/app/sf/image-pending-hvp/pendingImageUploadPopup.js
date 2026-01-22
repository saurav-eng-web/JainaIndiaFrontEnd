import { Upload } from "lucide-react"; // Importing an icon for the upload button
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import UploadProgress from "@/components/ui/UploadProgress";
import { logger } from "@/utils/logger";
import { uploadImage } from "@/utils/uploadImage";

export default function PendingImageUploadPopup({ userId, onClose, ticketNo }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  const MAX_SIZE_MB = 5;
  const MAX_FILES = 5;

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

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

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return { success: false };
    }

    try {
      // Upload all files one by one with progress tracking
      const res = await uploadImage({
        files: files,
        ticketNo: userId || ticketNo,
        documentType: "HVP Parts",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });
      console.log("upload image res: ", res);
      return res;
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false };
    }
  };

  const handleSubmit = async () => {
    setIsDataLoading(true);
    setUploadProgress(0);
    setCurrentFileInfo(null);

    // 1) Upload files
    const uploadResult = await handleUpload();
    console.log("upload result: ", uploadResult);
    if (!uploadResult.success) {
      toast.error("File upload failed. Please try again.");
      setIsDataLoading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
      return;
    }

    // 2) After upload succeeds, call second API
    try {
      const res = await axiosInstance.post("PODetail/manage", {
        Action: "UPDATE",
        Status: "Part Pending Technical Approval",
        Id: userId,
      });

      if (
        res.data?.statusCode === 200 &&
        res.data?.message === "PODetail updated successfully"
      ) {
        toast.success("Image uploaded successfully");
        onClose();
      }
    } catch (err) {
      console.error("Save error", err);
      logger.error(`Save error ${err.message}`, "claim-approve/details");
      toast.error("Save failed. Please try again.");
    } finally {
      setIsDataLoading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
    }
  };

  return (
    <ModalSkeleton title={"Upload Image"} size="lg" onClose={onClose}>
      <div className="w-full min-w-xl space-y-4">
        {/* Input Section - Separated and Custom */}
        <ImageUpload variant="box" onChange={handleFileChange} multiple={true} />

        {/* Preview Section - Separated */}
        {previews.length > 0 && (
          <div className="rounded-lg border border-gray-400 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              Selected Images ({previews.length})
            </h4>
            <ImagePreview images={previews} onRemove={handleRemove} />
          </div>
        )}

        {/* Progress Bar Section */}
        <UploadProgress
          progress={uploadProgress}
          fileInfo={currentFileInfo}
          variant="default"
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isDataLoading || files.length === 0}>
          {isDataLoading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
