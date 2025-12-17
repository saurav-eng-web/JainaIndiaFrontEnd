"use client";

import toast from "react-hot-toast";
import { useState } from "react";

import { useTheme } from "@/theme/ThemeContext";

export default function RemarkSection({ onSubmit, onCancel, remark, setRemark }) {
  // const [remark, setRemark] = useState("");
  const [disableButton, setDisableButton] = useState(false);
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
          disabled={disableButton}
          onClick={() => {
            if (!remark.trim()) {
              toast.error("Please enter a remark");
              return;
            }

            if (disableButton) {
              toast.error("Request already raised!");
              return;
            }
            setDisableButton(true);
            onSubmit?.(remark); // ✅ Approve flow
            setRemark("");
          }}
          className="cursor-pointer rounded px-4 py-2 text-white"
          style={{ background: colors.primary }}
        >
          Approve
        </button>

        <button
          disabled={disableButton}
          onClick={() => {
            if (!remark.trim()) {
              toast.error("Please enter a remark");
              return;
            }
            if (disableButton) {
              toast.error("Request already raised!");
              return;
            }
            setDisableButton(true);

            setRemark("");
            onCancel?.(); // ✅ Reject flow
          }}
          className="cursor-pointer rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
