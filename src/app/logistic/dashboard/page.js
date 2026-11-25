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

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

function CourierAvailabilityChart({ rows }) {
  const data = (rows || [])
    .map((r) => ({ name: (r.courierName || "").trim() || "Unassigned", value: Number(r.avi) || 0 }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <div className="py-10 text-center text-sm text-gray-500">No dockets available.</div>;
  }

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
              <rect x={cx - barW / 2} y={barY} width={barW} height={top + plotH - barY} rx="3" fill="#8b5cf6" opacity="0.9" />
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
  { key: "DefectivePart", label: "Defective Part", tone: "from-rose-50 to-rose-100/70", ring: "hover:ring-rose-200" },
  { key: "DefectiveDOA", label: "Defective DOA", tone: "from-orange-50 to-orange-100/70", ring: "hover:ring-orange-200" },
  { key: "GoodPart", label: "Good Part", tone: "from-emerald-50 to-emerald-100/70", ring: "hover:ring-emerald-200" },
  { key: "GoodMachine", label: "Good Machine", tone: "from-sky-50 to-sky-100/70", ring: "hover:ring-sky-200" },
  { key: "MismatchPart", label: "Mismatch Part", tone: "from-violet-50 to-violet-100/70", ring: "hover:ring-violet-200" },
  { key: "MismatchMachine", label: "Mismatch Machine", tone: "from-slate-50 to-slate-100", ring: "hover:ring-slate-200" },
];

const DOCKET_STATUS_ITEMS = [
  { key: "pickupAwaited", label: "Pickup Awaited", tone: "from-orange-50 to-amber-100/70" },
  { key: "inTransit", label: "In Transit", tone: "from-sky-50 to-blue-100/70" },
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
      const res = await axiosInstance.post("logistic/dashboard/process", { type: "summary" });
      setSummary(res.data?.data ?? null);
    } catch (error) {
      toast.error("Failed to load dashboard summary");
    } finally {
      setIsLoading(false);
    }
  }

  const courierRows = summary?.courierAvailability || [];
  const courierTotal = courierRows.reduce((sum, r) => sum + (Number(r.avi) || 0), 0);
  const courierCount = courierRows.length;

  function handleCardClick(typeKey) {
    router.push(`/logistic/statusview?type=${typeKey}`);
  }

  return (
    <PageSkeleton title="Logistic Dashboard" rolesAllowed={["logistic"]}>
      <Subheading title="Dispatch Status" />

      <div className="mt-4 flex flex-wrap gap-4">
        {DOCKET_STATUS_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`flex min-w-[190px] items-baseline justify-between gap-6 rounded-xl bg-gradient-to-br ${item.tone} px-4 py-2.5 shadow-sm`}
          >
            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
            <p className="text-xl font-bold text-gray-900">
              {isLoading ? "..." : Number(summary?.[item.key] ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Subheading title="Challan Summary" />
      </div>
      
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_CARDS.map((card) => {
          const field = card.key.charAt(0).toLowerCase() + card.key.slice(1);
          const raw = summary ? summary[field] : null;
          const count = summary ? Number(raw ?? 0).toLocaleString() : "...";

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleCardClick(card.key)}
              className={`group flex cursor-pointer flex-col rounded-2xl bg-gradient-to-br ${card.tone} px-6 py-5 text-left shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${card.ring}`}
            >
              <span className="text-base font-semibold text-gray-800">{card.label}</span>
              <span className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">{count}</span>
              <span className="mt-2 text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-800">
                View details &rarr;
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <Subheading title="Courier Availability" />
        <div className="mt-5 grid grid-cols-1 gap-5 rounded-2xl bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col justify-center lg:border-r lg:border-violet-100 lg:pr-5">
            <p className="text-sm font-semibold text-violet-700">Total available dockets</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-violet-700">
              {isLoading ? "..." : courierTotal.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              across <span className="font-semibold text-gray-700">{isLoading ? "-" : courierCount}</span> couriers
            </p>
          </div>
          <div className="min-w-0">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading...</div>
            ) : (
              <CourierAvailabilityChart rows={summary?.courierAvailability} />
            )}
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}
