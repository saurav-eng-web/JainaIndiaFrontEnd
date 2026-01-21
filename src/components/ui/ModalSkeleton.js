"use client";

import ProtectedRoute from "../auth/ProtectedRoute";

import { useTheme } from "@/theme/ThemeContext";

export default function ModalSkeleton({
  title,
  rolesAllowed = [],
  size = "full",
  children,
}) {
  const { colors } = useTheme();

  const modalSizeMap = {
    sm: "w-full max-w-sm min-h-[300px]",
    md: "w-full max-w-lg min-h-[400px]",
    lg: "w-full max-w-2xl min-h-[500px]",
    xl: "w-full max-w-5xl min-h-[600px]",
    full: "w-[90vw] min-h-[80vh]",
    content: "w-fit min-h-fit max-w-[95vw]",
  };
  return (
    <ProtectedRoute allowedRoles={rolesAllowed}>
      <div
        className={`flex ${
          modalSizeMap[size] || modalSizeMap.full
        } overflow-y-auto rounded-xl shadow-2xl`}
        style={{
          maxHeight: "90vh",
        }}
      >
        <div className="flex-1 bg-white">
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
