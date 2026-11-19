"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  MdWarningAmber, 
  MdBuild, 
  MdCheckCircle, 
  MdPrecisionManufacturing,
  MdErrorOutline,
  MdDeviceUnknown
} from "react-icons/md";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

// Column chart for the courier docket availability (replaces the long table, so no scrolling is needed).
// Plain SVG: the project has no chart library. The viewBox scales to the card width.
function CourierAvailabilityChart({ rows }) {
  const data = (rows || [])
    .map((r) => ({ name: (r.courierName || "").trim() || "Unassigned", value: Number(r.avi) || 0 }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <div className="py-10 text-center text-sm text-gray-500">No dockets available.</div>;
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const slot = 56; // width per courier
  const left = 56;
  const right = 16;
  const top = 24;
  const plotH = 230;
  const labelH = 96;
  const width = Math.max(640, left + right + data.length * slot);
  const height = top + plotH + labelH;

  const rawMax = Math.max(...data.map((d) => d.value), 1);
  const pow = 10 ** Math.floor(Math.log10(rawMax));
  const n = rawMax / pow;
  const axisMax = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(axisMax * f));
  const y = (v) => top + plotH - (v / axisMax) * plotH;

  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Total available dockets: <span className="font-semibold text-gray-800">{total.toLocaleString()}</span> across{" "}
        {data.length} couriers
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Available dockets per courier">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={left} x2={width - right} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth="1" />
            <text x={left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
              {t.toLocaleString()}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = left + i * slot + slot / 2;
          const barW = slot * 0.6;
          const barY = y(d.value);
          return (
            <g key={`${d.name}-${i}`}>
              <title>{`${d.name}: ${d.value.toLocaleString()} dockets`}</title>
              <rect x={cx - barW / 2} y={barY} width={barW} height={top + plotH - barY} rx="3" fill="#714b67" opacity="0.9" />
              <text x={cx} y={barY - 5} textAnchor="middle" fontSize="11" fontWeight="600" fill="#374151">
                {d.value.toLocaleString()}
              </text>
              <text
                x={cx}
                y={top + plotH + 14}
                textAnchor="end"
                fontSize="11"
                fill="#374151"
                transform={`rotate(-40 ${cx} ${top + plotH + 14})`}
              >
                {d.name}
              </text>
            </g>
          );
        })}
        <line x1={left} x2={width - right} y1={top + plotH} y2={top + plotH} stroke="#9ca3af" strokeWidth="1" />
      </svg>
    </div>
  );
}

const DASHBOARD_CARDS = [
  { key: "DefectivePart", label: "Defective Part", icon: MdBuild, bg: "bg-red-50", text: "text-red-700", ring: "ring-red-500" },
  { key: "DefectiveDOA", label: "Defective DOA", icon: MdWarningAmber, bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-500" },
  { key: "GoodPart", label: "Good Part", icon: MdCheckCircle, bg: "bg-green-50", text: "text-green-700", ring: "ring-green-500" },
  { key: "GoodMachine", label: "Good Machine", icon: MdPrecisionManufacturing, bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-500" },
  { key: "MismatchPart", label: "Mismatch Part", icon: MdErrorOutline, bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-500" },
  { key: "MismatchMachine", label: "Mismatch Machine", icon: MdDeviceUnknown, bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-500" },
];

export default function LogisticDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("logistic/dashboard/summary");
      setSummary(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard summary");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCardClick(typeKey) {
    router.push(`/logistic/statusview?type=${typeKey}`);
  }

  return (
    <PageSkeleton title="Logistic Dashboard" rolesAllowed={["logistic"]}>
      <Subheading title="Challan Summary" />
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_CARDS.map((card, index) => {
          const Icon = card.icon;
          // API JSON is camelCase (DefectivePart -> defectivePart)
          const field = card.key.charAt(0).toLowerCase() + card.key.slice(1);
          const count = summary ? (summary[field] ?? "0") : "...";
          
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleCardClick(card.key)}
              className={`group flex cursor-pointer flex-col rounded-xl border-l-4 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.bg} border-gray-200`}
            >
              <div className="flex w-full items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <span className={`mt-1 block text-3xl font-bold ${card.text}`}>
                    {count}
                  </span>
                </div>
                <div className={`rounded-full p-3 transition-transform duration-300 group-hover:scale-110 ${card.bg}`}>
                  <Icon className={`h-7 w-7 ${card.text}`} />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 group-hover:text-gray-600">Click to view details &rarr;</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <Subheading title="Courier Availability" />
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">Loading...</div>
          ) : (
            <CourierAvailabilityChart rows={summary?.courierAvailability} />
          )}
        </div>
      </div>
    </PageSkeleton>
  );
}
