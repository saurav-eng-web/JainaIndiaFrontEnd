'use client';

import { useTheme } from '@/theme/ThemeContext';

export default function SectionHeading({ children }) {
  const { colors } = useTheme();

  return (
    <h2
      className="text-left pl-[10px] mb-[30px] font-bold border-2 text-lg p-[5px] rounded-[5px]"
      style={{
        color: colors.primary,
        borderColor: colors.primary,
      }}
    >
      {children}
    </h2>
  );
}