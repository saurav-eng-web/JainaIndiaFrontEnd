"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/ui/InputWithLabel";
import Modal from "@/components/ui/Modal";
import ModalSkeleton from "@/components/ui/ModalSkeleton";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <PageSkeleton title="Test Admin" rolesAllowed={["sf/ssd"]}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <TestModal />
      </Modal>
      <ColorPalettePage />
    </PageSkeleton>
  );
}

function TestModal() {
  const [remarks, setRemarks] = useState("");
  return (
    <ModalSkeleton>
      <InputWithLabel
        label="Test"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </ModalSkeleton>
  );
}

// 1. Your Color Data
const colors = {
  primary: "#714b67",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#fff",
  info: "#17a2b8",
  light: "black",
  dark: "#343a40",
  background: "#f1f1f1",
  sidebarBg: "#222f3e",
  cardBg: "#f3f4f6",
  textColor: "white",
  lightBorder: "#a6829d",
};

function ColorPalettePage() {
  const [copied, setCopied] = useState(null); // "Copied!" | (null > null);

  const handleCopy = (colorCode, colorName) => {
    navigator.clipboard.writeText(colorCode);
    setCopied(colorName);

    // Reset the "Copied!" text after 2 seconds
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Design System Colors</h1>
          <p className="mt-2 text-gray-500">
            Click on any color box to copy the hex code to your clipboard.
          </p>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Object.entries(colors).map(([name, value]) => (
            <div
              key={name}
              onClick={() => handleCopy(value, name)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Color Swatch Area */}
              <div
                className="relative flex h-32 w-full items-center justify-center border-b border-gray-100"
                style={{ backgroundColor: value }}
              >
                {/* Overlay for 'Copied' state */}
                {copied === name && (
                  <div className="animate-in fade-in absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] duration-200">
                    <span className="text-sm font-bold tracking-wide text-white uppercase">
                      Copied!
                    </span>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{name}</p>
                    <p className="mt-1 font-mono text-xs text-gray-500 uppercase">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
