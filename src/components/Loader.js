"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function GlobalOverlayLoader() {
  const loading = useSelector((state) => state.loader.loading);
  const [visible, setVisible] = useState(false);

  // Handle fade-in / fade-out
  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${loading ? "opacity-100" : "opacity-0"} `}
    >
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>
  );
}
