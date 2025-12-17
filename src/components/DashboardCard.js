import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "@/theme/ThemeContext";

export default function DashboardCard({
  title,
  value,
  Icon,
  iconColor = "text-gray-500",
}) {
  const { colors } = useTheme();
  const percentage = typeof value === "number" ? Math.min((value / 2000) * 100, 100) : 0;

  return (
    <div className="relative flex min-h-[170px] flex-col items-center justify-center rounded-xl bg-white p-4 shadow-md">
      <div className="absolute top-2 right-2 text-xl">
        <Icon className={`${iconColor}`} />
      </div>
      <div className="mb-2 h-20 w-20">
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            pathColor: iconColor.replace("text-", ""),
            trailColor: "#eee",
            pathColor: colors.primary,
          })}
        >
          <div className="text-xl font-bold text-gray-800">{value}</div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="mt-2 text-center text-sm font-semibold text-gray-700">{title}</div>
    </div>
  );
}
