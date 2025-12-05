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
