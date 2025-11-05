// import React from "react";
// import { useTheme } from '@/theme/ThemeContext';

// export default function Popup({ isOpen, message, onClose }) {
//   if (!isOpen) return null;

//   const { colors } = useTheme();
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
//         <p className="text-lg font-semibold mb-4">{message}</p>
//         <button
//           onClick={onClose}
//           className="text-white px-4 py-2 rounded hover:bg-blue-600" style={{background:colors.primary}}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { useTheme } from "@/theme/ThemeContext";

export default function Popup({ isOpen, message, onClose }) {
  // ✅ Always call hooks at the top level (before any conditional logic)
  const { colors } = useTheme();

  // ❌ Avoid returning before hooks — do it *after* calling them
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
        <p className="mb-4 text-lg font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="rounded px-4 py-2 text-white hover:bg-blue-600"
          style={{ background: colors.primary }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
