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
    min,
    max,
  },
  ref
) {
  const styles = sizeMap[size] || sizeMap.md;

  function handleKeyPress(event) {
    if (event.key === "Enter" && onEnterKeyPressed) {
      onEnterKeyPressed();
    }
  }

  // Prevent non-numeric characters when type=number
  function handleNumberKeyDown(e) {
    if (type !== "number") return;

    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];

    if (allowed.includes(e.key)) return;

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  // Clamp value within min/max on blur
  function handleBlur(e) {
    if (type === "number" && (min !== undefined || max !== undefined)) {
      let val = Number(e.target.value);

      if (min !== undefined && val < Number(min)) val = Number(min);
      if (max !== undefined && val > Number(max)) val = Number(max);

      // fire change if corrected
      if (val !== Number(e.target.value)) {
        onChange?.({
          target: {
            name,
            value: String(val),
          },
        });
      }
    }

    onBlur?.(e);
  }

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {/* Label area (height preserved) */}
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

      <input
        id={id || name}
        ref={ref}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          handleKeyPress(e);
          handleNumberKeyDown(e);
        }}
        placeholder={placeholder}
        disabled={disabled}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        className={clsx(
          "h-10 rounded-lg border border-[#a6829d] transition-all outline-none",
          "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
          !disabled ? "bg-white" : "cursor-not-allowed bg-gray-100 opacity-75",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          type === "number" &&
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          styles.input
        )}
      />

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});
