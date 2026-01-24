"use client";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import React from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-[#714b67] text-white cursor-pointer hover:bg-[#5e3f56] focus:ring-[#714b67]",
  outline:
    "border border-[#714b67] text-[#714b67] cursor-pointer hover:text-[#5e3f56] focus:border-[#dc3545]",
  verified:
    " text-green-600 border border-green-600 cursor-not-allowed opacity-90 flex items-center gap-2",
};

const DISABLED_CLASSES =
  "cursor-not-allowed opacity-60 bg-gray-300 text-gray-500 hover:bg-gray-300 focus:ring-0";

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const isVerified = variant === "verified";

  return (
    <button
      disabled={disabled || isVerified}
      className={clsx(
        "flex h-10 min-w-25 items-center justify-center rounded px-4 py-2 text-sm font-semibold transition focus:outline-none",
        isVerified
          ? VARIANT_CLASSES.verified
          : disabled
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

// "use client";
// import React from "react";

// const VARIANT_CLASSES = {
//   primary: "bg-[#714b67] text-white hover:bg-[#5e3f56] focus:ring-[#714b67]",
//   outline:
//     "border-1 border-[#714b67] text-[#714b67] hover:text-[#5e3f56] focus:border-[#dc3545]",
// };

// export function Button({
//   children,
//   variant = "primary", // primary | simple
//   className = "",
//   ...props
// }) {
//   return (
//     <button
//       className={`h-10 min-w-25 cursor-pointer rounded px-4 py-2 text-sm font-semibold transition focus:ring-2 focus:ring-offset-2 focus:outline-none ${VARIANT_CLASSES[variant]} ${className} `}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }
