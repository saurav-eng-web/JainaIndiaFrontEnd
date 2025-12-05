"use client";

import { useState } from "react";

import { useTheme } from "@/theme/ThemeContext";

export default function RemarkSection({ onSubmit, onCancel }) {
  const [remark, setRemark] = useState("");
  const { colors } = useTheme();

  return (
    <div className="remark-section mb-10 max-w-full rounded-lg border bg-white p-4 shadow-md">
      <h3 className="mb-3 text-lg font-semibold">📝 Add Remark</h3>

      <input
        type="text"
        placeholder="Enter your remark..."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        className="mb-4 w-2/4 rounded border p-2 focus:ring focus:ring-blue-300"
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            if (!remark.trim()) return alert("Please enter a remark");
            onSubmit?.(remark); // ✅ Approve flow
            setRemark("");
          }}
          className="rounded px-4 py-2 text-white"
          style={{ background: colors.primary }}
        >
          Approve
        </button>

        <button
          onClick={() => {
            setRemark("");
            onCancel?.(); // ✅ Reject flow
          }}
          className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
