'use client';
import { useTheme } from '@/theme/ThemeContext';

export default function Loader() {

  const { colors } = useTheme();
  return (
    <div
    className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
    style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
  ></div>
  );
} 