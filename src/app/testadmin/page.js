"use client";
import { useTheme } from "@/theme/ThemeContext";

export default function Page() {
  const { colors } = useTheme();

  return (
    <div className="space-y-10 p-8">
      <div className="mt-4 mb-2">
        <h3
          className="border-l-4 pl-2 text-[15px] font-medium"
          style={{
            borderColor: colors.primary,
            color: colors.primary,
          }}
        >
          Recent Updates
        </h3>
      </div>
      <div className="mt-4">
        <h3
          className="inline-block rounded-md px-3 py-1 text-[14px] font-medium"
          style={{
            background: `${colors.primary}15`,
            color: colors.primary,
          }}
        >
          Technician Remarks
        </h3>
      </div>
      <div className="mt-4">
        <h3
          className="inline-block pb-1 text-[15px] font-semibold"
          style={{
            borderBottom: `2px solid ${colors.primary}`,
            color: colors.primary,
          }}
        >
          Status Timeline
        </h3>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: colors.primary }} />
        <h3 className="text-[15px] font-medium" style={{ color: colors.primary }}>
          Attachments
        </h3>
      </div>
      <div className="rounded-xl py-8">
        <h2
          className="rounded-lg p-2 text-[18px] font-semibold"
          style={{
            color: colors.primary,
            border: `2px solid ${colors.primary}`,
          }}
        >
          Complaint History
        </h2>

        {/* Subheading 5: Combined Layout */}
        <div className="mt-6 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3
                className="mb-1 text-[16px] font-semibold"
                style={{ color: colors.primary }}
              >
                Case Summary
              </h3>
              <p className="text-sm text-gray-600">
                Total: 8 complaints • 5 Active • 3 Resolved
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium" style={{ color: colors.primary }}>
                Filter by:
              </span>
              <select
                className="rounded-lg border px-3 py-1.5 text-sm"
                style={{ borderColor: colors.primary }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div
              className="rounded-lg border-l-4 p-3"
              style={{
                borderLeftColor: colors.primary,
                backgroundColor: `${colors.primary}08`,
              }}
            >
              <p className="text-sm text-gray-600">Open</p>
              <p className="mt-1 text-lg font-bold" style={{ color: colors.primary }}>
                3
              </p>
            </div>

            <div
              className="rounded-lg border-l-4 p-3"
              style={{ borderLeftColor: "#10B981", backgroundColor: "#F0FDF4" }}
            >
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="mt-1 text-lg font-bold" style={{ color: "#10B981" }}>
                2
              </p>
            </div>

            <div
              className="rounded-lg border-l-4 p-3"
              style={{ borderLeftColor: "#F59E0B", backgroundColor: "#FFFBEB" }}
            >
              <p className="text-sm text-gray-600">Pending</p>
              <p className="mt-1 text-lg font-bold" style={{ color: "#F59E0B" }}>
                1
              </p>
            </div>

            <div
              className="rounded-lg border-l-4 p-3"
              style={{ borderLeftColor: "#6B7280", backgroundColor: "#F9FAFB" }}
            >
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="mt-1 text-lg font-bold" style={{ color: "#6B7280" }}>
                3
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        {/* The Pillar */}
        <div
          className="h-6 w-1 rounded-r-md"
          style={{ backgroundColor: colors.primary }}
        ></div>

        {/* The Text */}
        <h3 className="text-[16px] font-medium text-gray-700">Ticket Details</h3>
      </div>
      <h3
        className="mb-4 inline-block rounded-md px-3 py-1 text-[14px] font-semibold tracking-wide"
        style={{
          color: colors.primary,
          backgroundColor: `${colors.primary}1a`, // 10% opacity version of primary
        }}
      >
        DEVICE INFORMATION
      </h3>
      <div className="mb-6">
        <h3
          className="inline-block pb-1 text-[16px] font-medium"
          style={{
            color: colors.primary,
            borderBottom: `2px solid ${colors.primary}`,
          }}
        >
          Technician Remarks
        </h3>
        {/* Optional Faded Line Extension */}
        <div className="h-[1px] w-full bg-gray-200"></div>
      </div>
      <div className="mt-4">
        <h3
          className="pb-1 text-[15px] font-semibold"
          style={{
            color: colors.primary,
            borderBottom: "2px solid",
            borderImage: `linear-gradient(to right, ${colors.primary}, transparent) 1`,
          }}
        >
          Complaint Timeline
        </h3>
      </div>
      <div className="mt-4">
        <h3
          className="text-[15px] font-semibold"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, #94a3b8)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Technician Remarks
        </h3>
      </div>
      <div className="mt-4">
        <h3
          className="text-[15px] font-semibold"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, #94a3b8)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Technician Remarks
        </h3>
      </div>
      <div className="mt-4">
        <h3
          className="relative pb-2 text-[15px] font-medium"
          style={{ color: colors.primary }}
        >
          Attachments
          <span
            className="absolute bottom-0 left-0 h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary}40 40%, transparent 100%)`,
            }}
          />
        </h3>
      </div>
      <div
        className="mt-4 inline-block rounded-md px-3 py-1"
        style={{
          background: `linear-gradient(90deg, ${colors.primary}15, transparent)`,
          borderLeft: `3px solid ${colors.primary}`,
        }}
      >
        <h3 className="text-[14px] font-medium" style={{ color: colors.primary }}>
          Status Updates
        </h3>
      </div>
    </div>
  );
}
