"use client";

import { useTheme } from "@/theme/ThemeContext";

export default function SectionHeading({ children }) {
  const { colors } = useTheme();

  return (
    <h2
      className="mb-[30px] rounded-[5px] border-2 p-[5px] pl-2.5 text-left text-lg font-bold"
      style={{
        color: colors.primary,
        borderColor: colors.primary,
      }}
    >
      {children}
    </h2>
  );
}
