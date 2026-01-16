"use client";

import ProtectedRoute from "../auth/ProtectedRoute";

import { useTheme } from "@/theme/ThemeContext";

const modalSizeMap = {
  sm: "min-w-md",
  md: "min-w-2xl",
  lg: "min-w-4xl",
  xl: "min-w-6xl",
  full: "min-w-[90vw]",
};

export default function ModalSkeleton({
  title,
  rolesAllowed = [],
  // width = "xl",
  // height = "md", // 👈 default size
  children,
}) {
  const { colors } = useTheme();

  return (
    <ProtectedRoute allowedRoles={rolesAllowed}>
      <div
        // className={`flex ${width} ${height} overflow-y-auto rounded-xl`}
        className={`flex min-h-[80vh] w-[90vw] overflow-y-auto rounded-xl`}
        // className={`flex ${modalSizeMap[size] || modalSizeMap.md} overflow-y-auto rounded-xl bg-yellow-300`}
      >
        <div className="flex-1">
          <div className="rounded-xl p-8">
            <h2
              className="mb-6 rounded-lg p-2 text-[18px] font-semibold"
              style={{
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
              }}
            >
              {title}
            </h2>

            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
