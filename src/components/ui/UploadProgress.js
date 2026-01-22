import React from "react";

/**
 * UploadProgress Component
 * @param {number} progress - Progress percentage (0-100)
 * @param {object} fileInfo - Object with { current, total } file count
 * @param {string} variant - 'default' | 'compact' | 'detailed'
 * @param {string} className - Additional CSS classes
 */
export default function UploadProgress({
  progress = 0,
  fileInfo = null,
  variant = "default",
  className = "",
}) {
  if (progress === 0) return null;

  return (
    <div className={`rounded-lg border border-blue-200 bg-blue-50 p-4 ${className}`}>
      {/* Header with label and percentage */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Uploading...</span>
        <span className="text-sm font-semibold text-blue-600">
          {progress}%{fileInfo && ` (File ${fileInfo.current}/${fileInfo.total})`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Optional: Detailed view with file info */}
      {variant === "detailed" && fileInfo && (
        <div className="mt-2 text-xs text-gray-600">
          <p>
            Uploading file {fileInfo.current} of {fileInfo.total}
          </p>
        </div>
      )}

      {/* Compact variant - just bar with percentage */}
      {variant === "compact" && (
        <div className="mt-1 text-right text-xs text-blue-600">{progress}%</div>
      )}
    </div>
  );
}
