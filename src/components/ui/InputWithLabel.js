"use client";

import clsx from "clsx";
import React, { forwardRef } from "react";

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

export default forwardRef(function InputField(
  {
    label,
    value,
    onChange,
    onBlur,
    placeholder,
    type = "text",
    size = "md",
    disabled = false,
    error = "",
    required = false,
    name,
    id,
    className,
    message,
    onEnterKeyPressed,
  },
  ref
) {
  const styles = sizeMap[size] || sizeMap.md;

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      onEnterKeyPressed();
    }
  }

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      <div className={clsx("min-h-[1.25rem]", styles.label)}>
        {label ? (
          <label htmlFor={id || name} className="font-medium text-[#714b67]">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
            {message && <span className="ml-2 text-xs text-gray-500">{message}</span>}
          </label>
        ) : (
          <span className="invisible">placeholder</span>
        )}
      </div>

      {/* Input */}
      <input
        id={id || name}
        ref={ref}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={handleKeyPress}
        className={clsx(
          "rounded-lg border border-[#a6829d] transition-all outline-none",
          "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
          !disabled ? "bg-white" : "cursor-not-allowed bg-gray-100 opacity-75",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          styles.input
        )}
      />

      {/* Error */}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});
