"use client";

import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "./button";

const VARIANTS = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    btn: "primary",
  },
  failure: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    btn: "outline",
  },
};

export default function StatusModal({
  open,
  type = "success", // success | failure
  title,
  message,
  onClose,
}) {
  if (!open) return null;

  const config = VARIANTS[type] || VARIANTS.success;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`w-[32rem] rounded-lg border bg-white p-6 shadow-lg ${config.border}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 rounded-full p-3 ${config.bg}`}>
            <Icon className={`h-12 w-12 ${config.color}`} />
          </div>

          <h2 className="mb-2 text-lg font-semibold">{title}</h2>

          <p className="mb-6 text-sm whitespace-pre-line text-gray-700">{message}</p>

          <Button variant={config.btn} onClick={onClose} className="min-w-28">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
