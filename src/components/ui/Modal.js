"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

export default function Modal({
  open,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) {
  // 🔹 Close on ESC key
  useEffect(() => {
    if (!closeOnEsc || !open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal shell (NO SCROLL HERE) */}
      <div
        className="relative z-10 inline-block max-h-[90vh] max-w-[90vw] rounded-xl bg-white shadow-xl"
        style={{ border: "2px solid #714b67" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 text-xl font-bold text-[#714b67] hover:opacity-70"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* 🔹 Scroll wrapper (scroll lives here) */}
        <div className="modal-scroll max-h-[90vh] p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
