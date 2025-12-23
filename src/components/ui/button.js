import React from "react";

const VARIANT_CLASSES = {
  primary: "bg-[#714b67] text-white hover:bg-[#5e3f56] focus:ring-[#714b67]",
  danger:
    "border-1 border-[#714b67] text-[#714b67] hover:text-[#5e3f56] focus:border-[#dc3545]",
  // danger: "bg-[#dc3545] text-white hover:bg-[#b02a37] focus:ring-[#dc3545]",
};

export function Button({
  children,
  variant = "primary", // primary | danger
  className = "",
  ...props
}) {
  return (
    <button
      className={`h-11 min-w-[82px] cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition focus:ring-2 focus:ring-offset-2 focus:outline-none ${VARIANT_CLASSES[variant]} ${className} `}
      {...props}
    >
      {children}
    </button>
  );
}
