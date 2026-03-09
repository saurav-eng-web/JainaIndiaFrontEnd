import clsx from "clsx";
import { CheckCircle2, UploadCloud, Loader2 } from "lucide-react";
import React from "react";

import Modal from "@/components/ui/Modal";

/**
 * THEME TOKENS – matching your app
 */
const theme = {
  primary: "#714b67",
  primaryLight: "#f1e9ef",
  border: "#a6829d",
  success: "#16a34a",
};

/**
 * Inline Progress Card (non-blocking)
 */
export default function UploadProgress({
  progress = 0,
  fileInfo = null,
  variant = "default", // default | compact | detailed | success
  className = "",
}) {
  if (progress === 0 && variant !== "success") return null;

  const isComplete = progress >= 100 || variant === "success";

  return (
    <div
      className={clsx(
        "rounded-lg border p-4 transition-all",
        isComplete ? "border-green-200 bg-green-50" : "border-[#a6829d] bg-[#faf6f9]",
        className
      )}
    >
      {/* HEADER */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 size={18} className="text-green-600" />
          ) : (
            <UploadCloud size={18} style={{ color: theme.primary }} />
          )}

          <span className="text-sm font-semibold" style={{ color: theme.primary }}>
            {isComplete ? "Upload Complete" : "Uploading..."}
          </span>
        </div>

        <span className="text-sm font-semibold" style={{ color: theme.primary }}>
          {progress}%{fileInfo && ` • ${fileInfo.current}/${fileInfo.total}`}
        </span>
      </div>

      {/* BAR */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white ring-1 ring-[#a6829d]/20">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: isComplete ? theme.success : theme.primary,
          }}
        />
      </div>

      {/* DETAILS */}
      {variant === "detailed" && fileInfo && !isComplete && (
        <div className="mt-2 text-xs text-gray-600">
          Uploading file {fileInfo.current} of {fileInfo.total}
        </div>
      )}

      {variant === "compact" && (
        <div className="mt-1 text-right text-xs" style={{ color: theme.primary }}>
          {progress}%
        </div>
      )}
    </div>
  );
}

export function UploadProgressModal({
  open = false,
  progress = 0,
  fileInfo = null,
  title = "Uploading Files",
  subtitle = "Please keep this window open while the upload completes.",
  successMessage = "All files uploaded successfully",
}) {
  if (!open) return null;

  const isComplete = progress >= 100;

  return (
    <Modal open={open} mode="strict">
      <div className="w-[92vw] max-w-lg rounded-2xl bg-white px-7 py-6 shadow-lg sm:px-8 sm:py-7">
        <div className="mb-6">
          <div className="text-lg font-semibold" style={{ color: theme.primary }}>
            {isComplete ? "Upload Complete" : title}
          </div>

          <div className="mt-2 text-sm leading-relaxed text-gray-600">
            {isComplete ? successMessage : subtitle}
          </div>
        </div>

        {/* PROGRESS LABEL */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isComplete && (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: theme.primary }}
              />
            )}

            <span className="text-sm font-medium text-gray-700">
              Progress
              {fileInfo && ` • File ${fileInfo.current}/${fileInfo.total}`}
            </span>
          </div>

          <span className="text-base font-semibold" style={{ color: theme.primary }}>
            {progress}%
          </span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-[#f1e9ef]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: isComplete ? theme.success : theme.primary,
            }}
          />
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Do not refresh or close this page during upload.
        </div>
      </div>
    </Modal>
  );
}
