"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Image from "next/image";

const sizeMap = {
  sm: { input: "h-9 text-xs", label: "text-xs", preview: "h-14 w-14" },
  md: { input: "h-11 text-sm", label: "text-sm", preview: "h-20 w-20" },
  lg: { input: "h-12 text-base", label: "text-sm", preview: "h-24 w-24" },
  xl: { input: "h-14 text-lg", label: "text-base", preview: "h-28 w-28" },
};

export default function ImageUpload({
  label,
  value, // File | File[]
  onChange,
  required = false,
  error = "",
  name,
  id,
  size = "md",
  className,
  multiple = false,
  disabled = false,
}) {
  const styles = sizeMap[size] || sizeMap.md;
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!value) {
      setPreviews([]);
      return;
    }

    const files = Array.isArray(value) ? value : [value];
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    onChange(multiple ? files : files[0]);
  };

  const handleRemove = (index) => {
    if (multiple) {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange(null);
    }
  };

  return (
    <div className={clsx("flex w-full flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={id || name}
          className={clsx("font-medium text-[#714b67]", styles.label)}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className={clsx(
          "file:hover: block w-full cursor-pointer rounded-lg border bg-white px-1 py-1 text-gray-700",
          "file:mr-4 file:h-9 file:w-24 file:rounded-lg file:bg-[#714b67] file:text-white",
          "border-[#a6829d] focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
          disabled && "cursor-not-allowed opacity-70",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          styles.input
        )}
      />

      {previews.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div
              key={index}
              className={clsx("relative overflow-hidden rounded border", styles.preview)}
            >
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 rounded-full bg-black/60 px-1.5 text-xs text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// "use client";

// import clsx from "clsx";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// const sizeMap = {
//   sm: { input: "h-9 text-xs", label: "text-xs", preview: "h-14 w-14" },
//   md: { input: "h-11 text-sm", label: "text-sm", preview: "h-20 w-20" },
//   lg: { input: "h-12 text-base", label: "text-sm", preview: "h-24 w-24" },
//   xl: { input: "h-14 text-lg", label: "text-base", preview: "h-28 w-28" },
// };

// export default function ImageUpload({
//   label,
//   value,
//   onChange,
//   required = false,
//   error = "",
//   name,
//   id,
//   size = "md",
//   className,
// }) {
//   const styles = sizeMap[size] || sizeMap.md;
//   const [preview, setPreview] = useState(null);

//   useEffect(() => {
//     if (value instanceof File) {
//       const url = URL.createObjectURL(value);
//       setPreview(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [value]);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) onChange(file);
//   };

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

//       <input
//         id={id || name}
//         name={name}
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className={clsx(
//           "file:hover: block w-full cursor-pointer rounded-lg border bg-white px-1 py-1 text-gray-700",
//           "file:mr-4 file:h-9 file:w-24 file:rounded-lg file:bg-[#714b67] file:text-white",
//           "border-[#a6829d] focus:border-[#714b67] focus:ring-1 focus:ring-[#714b67]",
//           error && "border-red-500 focus:border-red-500 focus:ring-red-500",
//           styles.input
//         )}
//       />

//       {preview && (
//         <div className="mt-2 flex items-center gap-3">
//           <div
//             className={clsx("relative overflow-hidden rounded border", styles.preview)}
//           >
//             <Image src={preview} alt="Preview" fill className="object-cover" />
//           </div>
//         </div>
//       )}

//       {error && <span className="text-xs text-red-600">{error}</span>}
//     </div>
//   );
// }
