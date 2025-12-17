"use client";
import { useTheme } from "@/theme/ThemeContext";

export default function Loader() {
  const { colors } = useTheme();

  return (
    <div
      className="h-12 w-12 animate-spin rounded-full border-4 border-solid"
      style={{
        borderColor: `${colors.primary} transparent ${colors.primary} transparent`,
      }}
    ></div>
  );
}
