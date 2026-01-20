"use client";

import clsx from "clsx";

const sizeMap = {
  sm: {
    textarea: "min-h-[60px] px-2 py-1 text-sm",
    label: "text-xs",
  },
  md: {
    textarea: "min-h-[90px] px-3 py-2 text-sm",
    label: "text-sm",
  },
  lg: {
    textarea: "min-h-[130px] px-4 py-3 text-base",
    label: "text-sm",
  },
  xl: {
    textarea: "min-h-[180px] px-5 py-4 text-lg",
    label: "text-base",
  },
};

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  size = "md",
  disabled = false,
  error = "",
  required = false,
  name,
  id,
  rows,
  className,
}) {
  const styles = sizeMap[size] || sizeMap.md;

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className={clsx("font-medium text-[#714b67]", styles.label)}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={clsx(
          "resize-none rounded-lg border border-gray-300 bg-white transition-all outline-none",
          "focus:border-[#714b67] focus:ring-1 focus:ring-gray-400",
          disabled && "cursor-not-allowed bg-gray-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          styles.textarea
        )}
      />

      {/* Error */}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
