"use client";
import ProtectedRoute from "../auth/ProtectedRoute";
import SideBar from "../SideBar";

import { useTheme } from "@/theme/ThemeContext";

export default function PageSkeleton({ title, rolesAllowed = [], children }) {
  const { colors } = useTheme();
  return (
    <ProtectedRoute allowedRoles={rolesAllowed}>
      <div className="flex min-h-screen">
        <SideBar />
        <main className="ml-[60px] flex-1 bg-gray-100 p-6 transition-all duration-300">
          <section className="rounded-lg bg-white p-6 shadow-md">
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
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
