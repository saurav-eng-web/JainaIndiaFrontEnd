"use client";

import { useTheme } from "@/theme/ThemeContext";

export default function SectionHeading({ children }) {
  const { colors } = useTheme();

  return (
    <div className="rounded-xl py-8">
      <h2
        className="rounded-lg p-2 text-[18px] font-semibold"
        style={{
          color: colors.primary,
          border: `2px solid ${colors.primary}`,
        }}
      >
        {children}
      </h2>
    </div>
  );
}
