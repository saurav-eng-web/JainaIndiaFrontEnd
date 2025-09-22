// src/components/RemarkSection.jsx
'use client';

import { useState } from "react";
import { useTheme } from '@/theme/ThemeContext';

export default function RemarkSection({ onSubmit, onCancel }) {
  const [remark, setRemark] = useState("");
  const { colors } = useTheme();

  return ( 
    <div className="remark-section border rounded-lg p-4 mb-10 shadow-md bg-white max-w-full">
      <h3 className="text-lg font-semibold mb-3">📝 Add Remark</h3>

      <input
        type="text"
        placeholder="Enter your remark..."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        className="w-2/4 border rounded p-2 mb-4 focus:ring focus:ring-blue-300"
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            if (!remark.trim()) return alert("Please enter a remark");
            onSubmit?.(remark);
            setRemark("");
          }}
          className="text-white px-4 py-2 rounded" style={{background:colors.primary}}
        >
          Approve
        </button>

        <button
          onClick={() => {
            setRemark("");
            onCancel?.();
          }}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
