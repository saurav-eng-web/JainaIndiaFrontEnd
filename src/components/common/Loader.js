"use client";
import { useTheme } from "@/theme/ThemeContext";

export default function Loader() {
  const { colors } = useTheme();

  return (
    <div
      className="w-12 h-12 border-4 border-solid rounded-full animate-spin"
      style={{
        borderColor: `${colors.primary} transparent ${colors.primary} transparent`,
      }}
    ></div>
  );
}