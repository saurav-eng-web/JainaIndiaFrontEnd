import React from "react";
import { useTheme } from '@/theme/ThemeContext';

export default function Popup({ isOpen, message, onClose }) {
  if (!isOpen) return null;


  const { colors } = useTheme();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="text-white px-4 py-2 rounded hover:bg-blue-600" style={{background:colors.primary}}
        >
          OK
        </button>
      </div>
    </div>
  );
}
