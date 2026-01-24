"use client";

import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#714b67]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="flex h-10 w-full items-center justify-between rounded-lg border border-[#714b67] bg-white px-3 text-sm focus:ring-2 focus:ring-[#714b67]">
            <span>{value?.label || placeholder}</span>
            <ChevronDown size={16} />
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt}
                className={({ active }) =>
                  clsx(
                    "cursor-pointer px-3 py-2 text-sm",
                    active && "bg-[#714b67] text-white"
                  )
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {selected && <Check size={14} />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

// "use client";

// import clsx from "clsx";

// const sizeMap = {
//   sm: {
//     select: "h-8 px-2 text-sm",
//     label: "text-xs",
//   },
//   md: {
//     select: "h-10 px-3 text-sm",
//     label: "text-sm",
//   },
//   lg: {
//     select: "h-12 px-4 text-base",
//     label: "text-sm",
//   },
//   xl: {
//     select: "h-14 px-5 text-lg",
//     label: "text-base",
//   },
// };

// export default function Dropdown({
//   label,
//   value,
//   onChange,
//   options = [],
//   placeholder = "Select",
//   size = "md",
//   disabled = false,
//   error = "",
//   required = false,
//   name,
//   id,
//   className,
// }) {
//   const styles = sizeMap[size] || sizeMap.md;

//   return (
//     <div className={clsx("flex w-full flex-col gap-1", className)}>
//       {label && (
//         <label
//           htmlFor={id || name}
//           className={clsx("font-medium text-[#714b67]", styles.label)}
//         >
//           {label}
//           {required && <span className="ml-1 text-red-500">*</span>}
//         </label>
//       )}

//       <select
//         id={id || name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         className={clsx(
//           "rounded-lg border border-[#a6829d] transition-all outline-none",
//           "focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
//           !disabled ? "bg-white" : "cursor-not-allowed bg-gray-100 opacity-75",
//           error && "border-red-500 focus:border-red-500 focus:ring-red-500",
//           styles.select
//         )}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>

//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>

//       {error && <span className="text-xs text-red-600">{error}</span>}
//     </div>
//   );
// }
