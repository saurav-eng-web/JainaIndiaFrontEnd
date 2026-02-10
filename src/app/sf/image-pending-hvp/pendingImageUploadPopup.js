import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { UploadProgressModal } from "@/components/ui/UploadProgress";
import { logger } from "@/utils/logger";
import { uploadImage } from "@/utils/uploadImage";

export default function PendingImageUploadPopup({ userId, onClose, ticketNo }) {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_IMAGES = 3;
  const MAX_VIDEO_SIZE_MB = 30;
  const MAX_VIDEOS = 1;

  useEffect(() => {
    if (!images || images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + images.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(`Each image must be less than ${MAX_IMAGE_SIZE_MB} MB`);
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (videos.length + 1 > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} video allowed`);
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      toast.error(`Video must be less than ${MAX_VIDEO_SIZE_MB}MB`);
      return;
    }

    setVideos([file]);
  };

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length === 0 || videos.length === 0) {
      toast.error("Please upload both images and video");
      return { success: false };
    }

    try {
      const allFiles = [...images, ...videos];
      setIsUploading(true);
      const res = await uploadImage({
        files: allFiles,
        ticketNo: userId || ticketNo,
        documentType: "HVP Parts",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });
      return res;
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsDataLoading(true);
    setUploadProgress(0);
    setCurrentFileInfo(null);

    // 1) Upload files
    const uploadResult = await handleUpload();
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
      <UploadProgressModal
        open={isUploading}
        title="Uploading Files"
        progress={uploadProgress}
        fileInfo={currentFileInfo}
      />
      <div className="w-full min-w-xl space-y-4">
        {/* Input Section - Separated and Custom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <ImageUpload
              label="Upload Images"
              variant="box"
              maxFileAllowed={MAX_IMAGES}
              maxFileSize={MAX_IMAGE_SIZE_MB}
              onChange={handleImageChange}
              multiple={true}
              accept="image/*"
              required
              disabled={images.length >= MAX_IMAGES}
            />
            {imagePreviews.length > 0 && (
              <div className="rounded-lg border border-gray-400 bg-white p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Selected Images ({imagePreviews.length})
                </h4>
                <ImagePreview images={imagePreviews} onRemove={handleRemoveImage} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <ImageUpload
              label="Upload Video"
              variant="box"
              maxFileAllowed={MAX_VIDEOS}
              maxFileSize={MAX_VIDEO_SIZE_MB}
              onChange={handleVideoChange}
              multiple={false}
              accept="video/*"
              required
              disabled={videos.length >= MAX_VIDEOS}
            />
            {videos.length > 0 && (
              <div className="rounded-lg border border-gray-400 bg-white p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Selected Video ({videos.length})
                </h4>
                <ImagePreview
                  images={videos.map(() => ({ type: "video" }))}
                  onRemove={handleRemoveVideo}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            isDataLoading || isUploading || images.length === 0 || videos.length === 0
          }
        >
          {isUploading ? "Uploading..." : isDataLoading ? "Submitting..." : "Upload"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
