import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import ImagePreview from "@/components/customui/image/ImagePreview";
import ImageUpload from "@/components/customui/image/ImageUpload";
import ModalSkeleton from "@/components/customui/ModalSkeleton";
import { UploadProgressModal } from "@/components/customui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

// [CUSTOM CHANGE]: Cumulative video limit configuration (Max 40MB combined across all videos)
const MAX_TOTAL_VIDEO_SIZE_MB = 40;
const MAX_TOTAL_BYTES = MAX_TOTAL_VIDEO_SIZE_MB * 1024 * 1024;

// [CUSTOM CHANGE]: Identify a selected file (same name + size + last modified = same video)
const getFileKey = (file) => `${file.name}|${file.size}|${file.lastModified}`;

export default function DOATDModal({ title, type, ticketNo, onClose }) {
  const [infoMessage, setInfoMessage] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingInitial, setIsCheckingInitial] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // [CUSTOM CHANGE]: Storing an array of video files instead of a single file to support multi-video upload
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  // [CUSTOM CHANGE]: Keys of videos already uploaded successfully, so a retry never re-uploads them
  const uploadedKeysRef = useRef(new Set());

  // [CUSTOM CHANGE]: Calculate cumulative file size of all selected videos in bytes and MB
  const totalVideoSizeBytes = useMemo(() => {
    return videoFiles.reduce((sum, file) => sum + (file.size || 0), 0);
  }, [videoFiles]);

  const totalVideoSizeMB = (totalVideoSizeBytes / (1024 * 1024)).toFixed(2);
  const isOverSizeLimit = totalVideoSizeBytes > MAX_TOTAL_BYTES;

  const activeUpload = isUploading
    ? {
        title: "Uploading Video",
        progress: uploadProgress,
        fileInfo: currentFileInfo,
      }
    : null;

  const router = useRouter();

  useEffect(() => {
    handleCheck("initial");
  }, [type, ticketNo]);

  // Request Eligible
  async function handleCheck(phase = "final") {
    if (!type || !ticketNo) return;
    if (phase === "initial") {
      setIsCheckingInitial(true);
      setInfoMessage("");
    }
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post(
        "po-validation/validate",
        {
          type: type,
          ticket_no: ticketNo,
          phase,
        },
        // Never leave the button stuck on "Submitting..." forever
        { timeout: 120000 }
      );

      if (phase === "initial") {
        if (res.data.statusCode === 200 && res.data.statusMsg === "Request Eligible") {
          setIsEligible(true);
          return { ok: true, statusMsg: res.data.statusMsg, statusCode: 200 };
        }

        setIsEligible(false);
        if (res.data.statusCode === 207 && res.data.statusMsg) {
          setInfoMessage(res.data.statusMsg);
        }
        return {
          ok: false,
          statusMsg: res.data.statusMsg,
          statusCode: res.data.statusCode,
        };
      }

      if (res.data.statusCode === 200) {
        setInfoMessage(res.data.statusMsg || "");
        return { ok: true, statusMsg: res.data.statusMsg, statusCode: 200 };
      }

      setInfoMessage(res.data.statusMsg || "");
      return {
        ok: false,
        statusMsg: res.data.statusMsg,
        statusCode: res.data.statusCode,
      };
    } catch (err) {
      console.error(`[DOATD] po-validation (${phase}) failed:`, {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      toast.error(
        err?.response?.data?.statusMsg ||
          err?.response?.data?.message ||
          (err?.code === "ECONNABORTED"
            ? "Server took too long to respond. Please try again."
            : "Failed to submit request")
      );
      // toastShown: error toast is already displayed above, so handleSubmit must not show another one
      return {
        ok: false,
        statusMsg: "Failed to submit request",
        statusCode: 500,
        toastShown: true,
      };
    } finally {
      setIsSubmitting(false);
      if (phase === "initial") setIsCheckingInitial(false);
    }
  }

  // [CUSTOM CHANGE]: Handle multi-video selection, validate mime type, deduplicate, and calculate total size
  const handleVideoChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    if (!incomingFiles.length) return;

    const validVideos = [];
    for (const file of incomingFiles) {
      if (!file.type.startsWith("video/")) {
        toast.error(`"${file.name}" is not a valid video file.`);
        continue;
      }
      validVideos.push(file);
    }

    if (!validVideos.length) return;

    // Deduplicate against already selected videos
    const updatedFiles = [...videoFiles];
    for (const v of validVideos) {
      const alreadyExists = updatedFiles.some(
        (existing) => existing.name === v.name && existing.size === v.size
      );
      if (!alreadyExists) {
        updatedFiles.push(v);
      }
    }

    const newTotalBytes = updatedFiles.reduce((sum, f) => sum + (f.size || 0), 0);
    const newTotalMB = (newTotalBytes / (1024 * 1024)).toFixed(2);

    if (newTotalBytes > MAX_TOTAL_BYTES) {
      toast.error(
        `Total video size exceeds ${MAX_TOTAL_VIDEO_SIZE_MB}MB (${newTotalMB}MB selected). Submit will be disabled.`
      );
    }

    setVideoFiles(updatedFiles);
  };

  // [CUSTOM CHANGE]: Remove a single video from selection and recalculate cumulative size
  const handleRemoveVideo = (indexToRemove) => {
    setVideoFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!isEligible) {
      toast.error("Request is not eligible.");
      return;
    }

    if (!videoFiles.length) {
      toast.error("Please upload at least one video before submitting.");
      return;
    }

    // [CUSTOM CHANGE]: Guard check to prevent submission if total size exceeds the 40MB limit
    if (isOverSizeLimit) {
      toast.error(
        `Total video size cannot exceed ${MAX_TOTAL_VIDEO_SIZE_MB}MB (Current: ${totalVideoSizeMB}MB). Please remove some videos.`
      );
      return;
    }

    try {
      // [CUSTOM CHANGE]: Skip videos already uploaded in an earlier attempt (e.g. when the final
      // check failed and the user retries) so the document server does not get duplicates
      const pendingFiles = videoFiles.filter((f) => !uploadedKeysRef.current.has(getFileKey(f)));

      if (pendingFiles.length) {
        setIsUploading(true);
        setUploadProgress(0);
        setCurrentFileInfo({ current: 1, total: pendingFiles.length });

        // [CUSTOM CHANGE]: Upload the remaining selected videos sequentially to document server
        const uploadResult = await uploadImage({
          files: pendingFiles,
          ticketNo: ticketNo,
          documentType: "HVP Parts",
          onProgress: (percent, current, total) => {
            setUploadProgress(percent);
            setCurrentFileInfo({ current, total });
          },
        });

        // Results are in the same order as pendingFiles; remember the ones that succeeded
        (uploadResult.data || []).forEach((r, idx) => {
          if (r.success && pendingFiles[idx]) {
            uploadedKeysRef.current.add(getFileKey(pendingFiles[idx]));
          }
        });

        if (!uploadResult.success) {
          console.error("[DOATD] video upload failed:", uploadResult);
          const failed = (uploadResult.data || []).filter((r) => !r.success);
          toast.error(
            failed.length
              ? `Upload failed for: ${failed.map((f) => f.fileName).join(", ")}`
              : "Video upload failed. Please try again."
          );
          return;
        }
      }

      // [CUSTOM CHANGE]: Close upload progress modal once file upload completes so UI is not stuck
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);

      const result = await handleCheck("final");
      if (result?.ok) {
        toast.success(result.statusMsg || "Request submitted successfully.");
        router.back();
      } else if (!result?.toastShown) {
        toast.error(result?.statusMsg || "Submission was not approved by server.");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileInfo(null);
    }
  };

  return (
    <ModalSkeleton title={title} size="xl">
      <UploadProgressModal
        open={Boolean(activeUpload)}
        title={activeUpload?.title}
        progress={activeUpload?.progress || 0}
        fileInfo={activeUpload?.fileInfo || null}
      />
      <div className="min-w-2xl">
        {isCheckingInitial && (
          <div className="flex min-h-32 justify-center">
            <div className="flex w-xl items-center justify-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
              <span className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          </div>
        )}

        {!isCheckingInitial && infoMessage && (
          <div className="flex min-h-32 justify-center">
            <div className="flex w-xl items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
              {infoMessage}
            </div>
          </div>
        )}
      </div>

      {isEligible && (
        <div className="mt-4 space-y-3">
          {/* [CUSTOM CHANGE]: multiple={true} enabled and custom helperText indicating cumulative 40MB limit */}
          <ImageUpload
            variant="box"
            onChange={handleVideoChange}
            multiple={true}
            accept="video/*"
            label="Upload video"
            helperText={`Multiple videos allowed. Total combined size max ${MAX_TOTAL_VIDEO_SIZE_MB}MB.`}
            required
            disabled={isUploading || isSubmitting}
          />

          {/* [CUSTOM CHANGE]: Selected videos count, cumulative size counter, English error alert, and previews */}
          {videoFiles.length > 0 && (
            <div className="space-y-2 px-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">
                  Videos Selected: {videoFiles.length}
                </span>
                <span
                  className={clsx(
                    "font-medium",
                    isOverSizeLimit ? "font-bold text-red-600" : "text-gray-600"
                  )}
                >
                  Total Size: {totalVideoSizeMB} MB / {MAX_TOTAL_VIDEO_SIZE_MB} MB
                  {isOverSizeLimit && ` (Exceeds ${MAX_TOTAL_VIDEO_SIZE_MB}MB limit!)`}
                </span>
              </div>

              {/* Warning banner if cumulative size exceeds the 40MB limit */}
              {isOverSizeLimit && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-700">
                  Total video size exceeds {MAX_TOTAL_VIDEO_SIZE_MB}MB ({totalVideoSizeMB}MB). Please remove some videos to proceed with submission.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <ImagePreview
                  images={videoFiles.map((file) => ({
                    type: "video",
                    name: file.name,
                  }))}
                  onRemove={handleRemoveVideo}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        {/* [CUSTOM CHANGE]: Submit is disabled if total size exceeds 40MB or if no video selected */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            isUploading ||
            !type ||
            !ticketNo ||
            !isEligible ||
            videoFiles.length === 0 ||
            isOverSizeLimit
          }
        >
          {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
