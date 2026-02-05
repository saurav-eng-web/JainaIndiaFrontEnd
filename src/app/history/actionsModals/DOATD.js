import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import { UploadProgressModal } from "@/components/ui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

const MAX_VIDEO_SIZE = 30;
const MAX_FILE_ALLOWED = 1;

export default function DOATDModal({ title, type, ticketNo, onClose }) {
  const [infoMessage, setInfoMessage] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingInitial, setIsCheckingInitial] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
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
      const res = await axiosInstance.post("po-validation/validate", {
        type: type,
        ticket_no: ticketNo,
        phase,
      });

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
      console.error("Error fetching engineer data:", err);
      toast.error("Failed to submit request");
      return { ok: false, statusMsg: "Failed to submit request", statusCode: 500 };
    } finally {
      setIsSubmitting(false);
      if (phase === "initial") setIsCheckingInitial(false);
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setVideoFile(null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
  };

  const handleSubmit = async () => {
    if (!isEligible) {
      toast.error("Request is not eligible.");
      return;
    }

    if (!videoFile) {
      toast.error("Please upload the video before submitting.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentFileInfo({ current: 1, total: 1 });

      const uploadResult = await uploadImage({
        files: videoFile,
        ticketNo: ticketNo,
        documentType: "HVP Parts",
        onProgress: (percent, current, total) => {
          setUploadProgress(percent);
          setCurrentFileInfo({ current, total });
        },
      });

      if (!uploadResult.success) {
        toast.error("Video upload failed. Please try again.");
        return;
      }

      const result = await handleCheck("final");
      if (result?.ok) {
        toast.success(result.statusMsg || "Request submitted successfully.");
        router.back();
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
          <ImageUpload
            variant="box"
            onChange={handleVideoChange}
            multiple={false}
            accept="video/*"
            label="Upload video"
            maxFileAllowed={MAX_FILE_ALLOWED}
            required
            maxFileSize={MAX_VIDEO_SIZE}
            disabled={isUploading || isSubmitting}
          />

          {videoFile && (
            <div className="h-14 px-2">
              <ImagePreview
                images={[{ type: "video" }]}
                onRemove={() => setVideoFile(null)}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading || !type || !ticketNo || !isEligible}
        >
          {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </ModalSkeleton>
  );
}
