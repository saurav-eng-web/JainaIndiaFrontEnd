"use client";

import clsx from "clsx";
import { Upload } from "lucide-react";

const sizeMap = {
  sm: {
    input: "h-8 px-2 text-sm",
    label: "text-xs",
  },
  md: {
    input: "h-10 px-3 text-sm",
    label: "text-sm",
  },
  lg: {
    input: "h-12 px-4 text-base",
    label: "text-sm",
  },
  xl: {
    input: "h-14 px-5 text-lg",
    label: "text-base",
  },
};

export default function ImageUpload({
  label,
  onChange,
  required = false,
  error = "",
  name,
  id,
  size = "md",
  className,
  multiple = false,
  disabled = false,
  variant = "input", // "input" | "box"
  accept = "image/*", // Can be "image/*", "video/*", or "image/*,video/*"
  maxFileSize = 5,
  maxFileAllowed = 5,
  message = "",
  helperText = "",
}) {
  const styles = sizeMap[size] || sizeMap.md;

  const handleFileChange = (e) => {
    if (onChange) {
      onChange(e);
    }

    try {
      e.target.value = null;
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {/* Label - Common for both or specific? Usually external for box, internal/top for input */}
      {label && (
        <label
          htmlFor={id || name}
          className={clsx("font-medium text-[#714b67]", styles.label)}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {message && <span className="ml-1 text-sm text-gray-500">{message}</span>}
        </label>
      )}

      {variant === "box" ? (
        // BOX VARIANT (Dashed Area)
        <div
          className={clsx(
            "rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
              : "cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100"
          )}
        >
          <label
            className={clsx(
              "flex flex-col items-center justify-center gap-2",
              disabled ? "pointer-events-none" : "cursor-pointer"
            )}
          >
            <div className="rounded-full bg-white p-3 shadow-sm">
              <Upload
                className={clsx(
                  "h-6 w-6",
                  disabled ? "text-gray-400" : "text-purple-700"
                )}
              />
            </div>
            <span
              className={clsx(
                "text-sm font-medium",
                disabled ? "text-gray-400" : "text-[#714b67]"
              )}
            >
              Click to upload {accept.includes("video") ? "video" : "image"}
            </span>
            <span className="text-xs text-gray-500">
              {helperText ||
                (accept.includes("video")
                  ? `Max ${maxFileAllowed} videos. (Max ${maxFileSize}MB per file)`
                  : `Max ${maxFileAllowed} images. (Max ${maxFileSize}MB per file)`)}
            </span>
            <input
              id={id || name}
              name={name}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple={multiple}
              accept={accept}
              disabled={disabled}
              tabIndex={-1}
            />
          </label>
        </div>
      ) : (
        // INPUT VARIANT (Mimics Text Input)
        <div className="relative w-full">
          <input
            id={id || name}
            name={name}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileChange}
            className={clsx(
              "file:mr-4 file:h-full file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-[#714b67] file:px-4 file:text-white file:transition-colors file:hover:bg-[#5e3d55]",
              "block w-full cursor-pointer rounded-lg border border-[#a6829d] bg-white text-gray-700 transition-all focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
              disabled && "cursor-not-allowed bg-gray-100 opacity-75",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              styles.input,
              "pt-0 pb-0 pl-0" // Reset padding to let file button take full height left
            )}
          />
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
