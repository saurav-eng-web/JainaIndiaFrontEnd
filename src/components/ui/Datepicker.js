"use client";

import clsx from "clsx";

import { resolveRange } from "@/utils/dateRange";

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

export default function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  size = "md",
  disabled = false,
  error = "",
  required = false,
  name,
  id,
  className,
  message,
}) {
  const styles = sizeMap[size] || sizeMap.md;

  // 🔥 NEW RANGE LOGIC
  const { min: resolvedMin, max: resolvedMax } = resolveRange(min, max);

  const isAllowed = (date) => {
    if (!date) return true;

    if (resolvedMin && date < resolvedMin) return false;
    if (resolvedMax && date > resolvedMax) return false;

    return true;
  };

  const handleChange = (e) => {
    const val = e.target.value;

    // auto fix if out of range
    if (!isAllowed(val)) {
      const fixed =
        resolvedMin && val < resolvedMin
          ? resolvedMin
          : resolvedMax && val > resolvedMax
            ? resolvedMax
            : val;

      onChange?.(fixed);
      return;
    }

    onChange?.(val);
  };

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
          {message && <span className="ml-2 text-xs text-gray-500">{message}</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={id || name}
        name={name}
        type="date"
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        min={resolvedMin || undefined}
        max={resolvedMax || undefined}
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
}

// "use client";

// import clsx from "clsx";

// const sizeMap = {
//   sm: { input: "h-8 px-2 text-sm", label: "text-xs" },
//   md: { input: "h-10 px-3 text-sm", label: "text-sm" },
//   lg: { input: "h-12 px-4 text-base", label: "text-sm" },
//   xl: { input: "h-14 px-5 text-lg", label: "text-base" },
// };

// export default function DatePicker({
//   label,
//   value,
//   onChange,
//   size = "md",
//   required = false,
//   disabled = false,
//   error = "",
//   name,
//   id,
//   className,
//   min,
//   max,
//   message,
//   ...rest
// }) {
//   const styles = sizeMap[size] || sizeMap.md;

//   return (
//     <div className={clsx("flex w-full flex-col gap-1", className)}>
//       {/* Label (height preserved even if no label) */}
//       <div className={styles.label}>
//         {label ? (
//           <label htmlFor={id || name} className="font-medium text-[#714b67]">
//             {label}
//             {required && <span className="ml-1 text-red-500">*</span>}
//             {message && <span className="ml-2 text-xs text-gray-500">{message}</span>}
//           </label>
//         ) : (
//           <div className="h-[18px]" />
//         )}
//       </div>

//       <input
//         id={id || name}
//         name={name}
//         type="date"
//         value={value || ""}
//         onChange={(e) => onChange?.(e.target.value)}
//         disabled={disabled}
//         min={min}
//         max={max}
//         className={clsx(
//           "rounded-lg border border-[#a6829d] transition-all outline-none",
//           "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
//           !disabled ? "bg-white" : "cursor-not-allowed bg-gray-100 opacity-75",
//           error && "border-red-500 focus:border-red-500 focus:ring-red-500",
//           styles.input
//         )}
//       />

//       {error && <span className="text-xs text-red-600">{error}</span>}
//     </div>
//   );
// }
