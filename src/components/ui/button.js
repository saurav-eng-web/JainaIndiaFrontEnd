"use client";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import React, { useRef } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-[#714b67] text-white cursor-pointer hover:bg-[#5e3f56] focus:ring-[#714b67]",
  outline:
    "border border-[#714b67] text-[#714b67] cursor-pointer hover:text-[#5e3f56] focus:border-[#dc3545]",
  verified:
    "text-green-600 border border-green-600 cursor-not-allowed opacity-90 flex items-center gap-2",
};

const DISABLED_CLASSES =
  "cursor-not-allowed opacity-60 bg-gray-300 text-gray-100 hover:bg-gray-300 focus:ring-0";

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const isVerified = variant === "verified";

  // ---- Anti Double Click Guard ----
  const lockRef = useRef(false);

  const handleClick = (e) => {
    if (lockRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    lockRef.current = true;

    // execute user handler
    onClick?.(e);

    // auto release after 1 sec
    setTimeout(() => {
      lockRef.current = false;
    }, 1000);
  };

  const finalDisabled = disabled || isVerified;

  return (
    <button
      disabled={finalDisabled}
      onClick={handleClick}
      className={clsx(
        "flex h-10 min-w-25 items-center justify-center rounded px-4 py-2 text-sm font-semibold transition focus:outline-none",
        isVerified
          ? VARIANT_CLASSES.verified
          : finalDisabled
            ? DISABLED_CLASSES
            : VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {isVerified && <CheckCircle size={16} />}
      {children}
    </button>
  );
}
