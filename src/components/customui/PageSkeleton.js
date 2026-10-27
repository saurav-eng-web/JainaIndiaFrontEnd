/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Added optional backHref & BackButton support for Logistic Module
 * -----------------------------------------------------------------------------
 */
"use client";
import ProtectedRoute from "../auth/ProtectedRoute";
import SideBar from "../SideBar";
import BackButton from "./BackButton";

import { useTheme } from "@/theme/ThemeContext";

export default function PageSkeleton({ title, rolesAllowed = [], backHref, children }) {
  const { colors } = useTheme();
  return (
    <ProtectedRoute allowedRoles={rolesAllowed}>
      <div className="flex min-h-screen">
        <SideBar />
        <main className="ml-[60px] flex-1 min-w-0 bg-gray-100 p-6 transition-all duration-300">
          <section className="h-full rounded-lg bg-white p-6 shadow-md">
            {backHref ? (
              // Added by Saurav Date: 26-Oct-2026 for Logistic Module (Optional back button opt-in via backHref)
              <h2
                className="mb-6 flex items-center justify-between gap-4 rounded-lg p-2 text-xl font-semibold"
                style={{
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <span>{title}</span>
                <BackButton fallbackHref={backHref} className="text-sm font-medium" />
              </h2>
            ) : (
              <h2
                className="mb-6 rounded-lg p-2 text-xl font-semibold"
                style={{
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                }}
              >
                {title}
              </h2>
            )}
            {children}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
