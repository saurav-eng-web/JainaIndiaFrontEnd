import React from "react";

const sizeMap = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-4",
  lg: "h-14 w-14 border-4",
};

export default function Loading({ size = "lg", label = "Loading", showLabel = false }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-slate-500" role="status">
      <div
        className={`${sizeMap[size] || sizeMap.lg} animate-spin rounded-full border-[#714b67] border-t-transparent`}
        aria-hidden="true"
      />
      <span className={showLabel ? "" : "sr-only"}>{label}</span>
    </div>
  );
}