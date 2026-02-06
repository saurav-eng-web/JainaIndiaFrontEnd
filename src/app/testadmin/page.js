"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CancelReqModal from "../history/actionsModals/CancelReqModal";
import DOATDPopup from "../history/actionsModals/DOATD";
import PartIssueToEng from "../history/actionsModals/PartIssueToEng";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmationModal";
import DatePicker from "@/components/ui/Datepicker";
import ImagePreview from "@/components/ui/image/ImagePreview";
import ImageUpload from "@/components/ui/image/ImageUpload";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import PageSkeleton from "@/components/ui/PageSkeleton";
import StatusModal from "@/components/ui/StatusModal";
import TimePicker from "@/components/ui/timepicker";
import UploadProgress, { UploadProgressModal } from "@/components/ui/UploadProgress";
import { uploadImage } from "@/utils/uploadImage";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [popup, setPopup] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageFileInfo, setImageFileInfo] = useState(null);
  const [videoFileInfo, setVideoFileInfo] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const activeUpload = imageUploading
    ? {
        title: "Uploading Images",
        progress: imageProgress,
        fileInfo: imageFileInfo,
      }
    : videoUploading
      ? {
          title: "Uploading Videos",
          progress: videoProgress,
          fileInfo: videoFileInfo,
        }
      : null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImageProgress(0);
    setImageFileInfo(null);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);
    setVideoFiles(files);
    setVideoProgress(0);
    setVideoFileInfo(null);
    setVideoPreviews((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return files.map((file) => ({
        type: "video",
        src: URL.createObjectURL(file),
        name: file.name,
      }));
    });
  };

  const runUpload = async ({
    files,
    documentType,
    setProgress,
    setFileInfo,
    setUploading,
  }) => {
    if (!files || files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setFileInfo(null);

      const result = await uploadImage({
        files,
        ticketNo: "TEST-001",
        documentType,
        onProgress: (progress, current, total) => {
          setProgress(progress);
          setFileInfo({ current, total });
        },
      });

      if (result.success) {
        toast.success(`Uploaded ${result.successCount}/${result.totalFiles} files.`);
      } else {
        toast.error("Upload finished with errors. Check logs.");
      }
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      videoPreviews.forEach((item) => URL.revokeObjectURL(item.src));
    };
  }, [imagePreviews, videoPreviews]);

  return (
    <PageSkeleton title="Test Admin">
      <UploadProgressModal
        open={Boolean(activeUpload)}
        title={activeUpload?.title}
        progress={activeUpload?.progress || 0}
        fileInfo={activeUpload?.fileInfo || null}
      />
      <div className="grid grid-cols-4 gap-4">
        <Button onClick={() => setPopup(true)}>open modal</Button>
        <Button onClick={() => toast.success("test")}>success</Button>
        <Button onClick={() => toast.error("test")}>failure</Button>
        <Button onClick={() => setShowModal(true)}>open success</Button>
      </div>

      <div className="mt-8 grid gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Upload Progress Demo</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <ImageUpload
              label="Upload Images"
              name="test-image-upload"
              accept="image/*"
              multiple
              maxFileAllowed={5}
              maxFileSize={10}
              onChange={handleImageChange}
              variant="box"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() =>
                  runUpload({
                    files: imageFiles,
                    documentType: "TEST_IMAGE",
                    setProgress: setImageProgress,
                    setFileInfo: setImageFileInfo,
                    setUploading: setImageUploading,
                  })
                }
                disabled={imageUploading || imageFiles.length === 0}
              >
                {imageUploading ? "Uploading..." : "Upload Images"}
              </Button>
              {imageFiles.length > 0 && (
                <span className="text-xs text-gray-500">
                  {imageFiles.length} file(s) selected
                </span>
              )}
            </div>
            <UploadProgress
              progress={imageProgress}
              fileInfo={imageFileInfo}
              variant="detailed"
            />
            {imagePreviews.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 text-xs font-semibold text-gray-600">
                  Image Preview ({imagePreviews.length})
                </div>
                <ImagePreview images={imagePreviews} onRemove={null} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <ImageUpload
              label="Upload Videos"
              name="test-video-upload"
              accept="video/*"
              multiple
              maxFileAllowed={3}
              maxFileSize={50}
              onChange={handleVideoChange}
              variant="box"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() =>
                  runUpload({
                    files: videoFiles,
                    documentType: "TEST_VIDEO",
                    setProgress: setVideoProgress,
                    setFileInfo: setVideoFileInfo,
                    setUploading: setVideoUploading,
                  })
                }
                disabled={videoUploading || videoFiles.length === 0}
              >
                {videoUploading ? "Uploading..." : "Upload Videos"}
              </Button>
              {videoFiles.length > 0 && (
                <span className="text-xs text-gray-500">
                  {videoFiles.length} file(s) selected
                </span>
              )}
            </div>
            <UploadProgress
              progress={videoProgress}
              fileInfo={videoFileInfo}
              variant="detailed"
            />
            {videoPreviews.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 text-xs font-semibold text-gray-600">
                  Video Preview ({videoPreviews.length})
                </div>
                <ImagePreview images={videoPreviews} onRemove={null} />
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusModal
        open={showModal}
        type="success" // failure
        title="Request Submitted"
        message="Your request has been processed successfully."
        onClose={() => setShowModal(false)}
      />
      <Modal open={popup} onClose={() => setPopup(false)}>
        <PartIssueToEng onClose={() => setPopup(false)} />
      </Modal>
    </PageSkeleton>
  );
}

function TestModal({ onClose }) {
  return (
    <ModalSkeleton title={"test"} size="md">
      <div className="min-w-sm">hi theretest modal</div>
      {/* <Button className="mt-20 ml-auto" variant="outline" onClick={onClose}>
        Cancel
      </Button> */}
      <Button className="mt-20 ml-auto" variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </ModalSkeleton>
  );
}
