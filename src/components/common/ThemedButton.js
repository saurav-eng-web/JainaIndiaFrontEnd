"use client";

import { useTheme } from "@/theme/ThemeContext";

export default function ThemedButton({ children, onClick, type = "default" }) {
  const { colors } = useTheme();

  // Define background and border based on type
  let bgColor = "transparent";
  let textColor = colors.text || "#000";
  let borderColor = colors.border || "#ccc";
  let hoverBg = "#f0f0f0";

  if (type === "primary") {
    bgColor = colors.primary;
    textColor = "#fff";
    borderColor = colors.primary;
    hoverBg = colors.primaryHover || colors.primary;
  } else if (type === "secondary") {
    bgColor = colors.secondary || "#eee";
    textColor = "#000";
    borderColor = colors.secondary || "#ccc";
    hoverBg = colors.secondaryHover || "#ddd";
  }

  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: bgColor, color: textColor, borderColor }}
      className={`rounded border px-4 py-2 transition hover:brightness-90`}
    >
      {children}
    </button>
  );
}
