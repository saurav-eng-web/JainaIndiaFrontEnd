"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SideBar from "@/components/SideBar";
import { useTheme } from "@/theme/ThemeContext";

function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>
  );
}

export default function HomeCC() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // TODO:
  //   const pathname = usePathname();

  const handleNavigate = (path) => {
    setLoading(true);
    router.push(path);
  };

  return (
    <ProtectedRoute allowedRoles={["cc"]}>
      <div className="flex min-h-screen" style={{ backgroundColor: colors.background }}>
        <SideBar />
        <div className="flex flex-1 items-start justify-center pt-[100px]">
          <div
            className="w-full max-w-[600px] rounded-xl p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            }}
          >
            <h2
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                marginBottom: "30px",
                fontWeight: 700,
                color: "#714b67",
                border: "2px solid #714b67",
                fontSize: "larger",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              Welcome to Jaina CRM
            </h2>
            <div className="flex flex-col items-center gap-5">
              <button
                className="flex w-[400px] cursor-pointer items-center justify-center rounded-lg px-6 py-4 text-[18px] font-bold transition-colors"
                style={{ backgroundColor: colors.primary, color: colors.warning }}
                onClick={() => handleNavigate("call")}
                disabled={loading}
              >
                {loading ? <Loader /> : "New Registration"}
              </button>
              <button
                className="flex w-[400px] cursor-pointer items-center justify-center rounded-lg px-6 py-4 text-[18px] font-bold transition-colors"
                style={{ backgroundColor: colors.primary, color: colors.warning }}
                onClick={() => handleNavigate("/search-complaint")}
                disabled={loading}
              >
                {loading ? <Loader /> : "Search Complaint"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
