"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

export default function Modal({
  open,
  onClose,
  children,

  // existing
  closeOnOverlayClick = true,
  closeOnEsc = true,

  // NEW
  mode = "default", // "default" | "strict"
}) {
  const isStrict = mode === "strict";

  // ---- ESC Handling ----
  useEffect(() => {
    if (!open) return;

    // In strict mode → ESC disabled
    if (isStrict) return;

    if (!closeOnEsc) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeOnEsc, onClose, isStrict]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ---- Overlay ---- */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={!isStrict && closeOnOverlayClick ? onClose : undefined}
      />

      {/* ---- Modal Container ---- */}
      <div
        className="relative z-10 inline-block max-h-[95vh] max-w-[95vw] rounded-xl bg-white shadow-xl"
        style={{ border: "2px solid #714b67" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Close Button (hidden in strict) ---- */}
        {!isStrict && (
          <button
            onClick={onClose}
            className="absolute top-3 right-4 z-20 cursor-pointer text-xl font-bold text-[#714b67] hover:opacity-70"
            aria-label="Close modal"
          >
            <X />
          </button>
        )}

        <div className="modal-scroll max-h-[95vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
}
