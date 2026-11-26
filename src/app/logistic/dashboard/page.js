"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronDown, Clock, FileSpreadsheet, PackageCheck, TriangleAlert, Truck } from "lucide-react";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import LogisticTable from "@/components/logistic/LogisticTable";
import { exportToExcel } from "@/utils/exportToExcel";

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

const STATUS_CARDS = [
  {
    key: "pickupAwaited",
    label: "Pickup Awaited",
    hint: "Waiting for courier pickup",
    icon: Clock,
    tone: "from-amber-500 to-orange-600",
    ring: "ring-orange-300",
    panel: "border-orange-200 bg-orange-50/60",
  },
  {
    key: "inTransit",
    label: "In Transit",
    hint: "Currently on the way",
    icon: Truck,
    tone: "from-sky-500 to-indigo-600",
    ring: "ring-indigo-300",
    panel: "border-indigo-200 bg-indigo-50/60",
  },
  {
    key: "delivered",
    label: "Delivered",
    hint: "This month",
    icon: PackageCheck,
    tone: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-300",
    panel: "border-emerald-200 bg-emerald-50/60",
  },
  {
    key: "challanToBeCancel",
    label: "Challan to be Cancel",
    icon: TriangleAlert,
    isAlert: true,
    panel: "border-red-300 bg-red-50/60",
  },
];

function AlertCard({ card, count, hasRisk, isClear, isSelected, onClick }) {
  const Icon = card.icon;
  const frame = hasRisk
    ? "border-red-600 bg-red-50 shadow-lg shadow-red-200"
    : "border-gray-300 bg-white shadow-md";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isSelected}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 ${frame} p-6 pt-7 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 ${
        isSelected ? "-translate-y-1 ring-4 ring-red-300" : ""
      }`}
    >
      {hasRisk && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-2"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #dc2626 0 10px, #facc15 10px 20px)" }}
        />
      )}
      <Icon
        aria-hidden="true"
        className={`pointer-events-none absolute -right-5 -bottom-6 h-36 w-36 transition-transform duration-300 group-hover:scale-110 ${
          hasRisk ? "text-red-600/10" : "text-gray-400/10"
        }`}
      />
      <span className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
            hasRisk ? "bg-red-600" : "bg-gray-400"
          }`}
        >
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <span className={`block text-base font-bold ${hasRisk ? "text-red-800" : "text-gray-700"}`}>
          {card.label}
        </span>
      </span>
      <span className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`text-5xl font-extrabold tracking-tight tabular-nums ${hasRisk ? "text-red-700" : "text-gray-700"}`}
        >
          {count}
        </span>
        {hasRisk && (
          <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Action needed
          </span>
        )}
        {isClear && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            No challan at risk
          </span>
        )}
      </span>
      <span
        className={`mt-4 flex items-center gap-1 text-sm font-semibold ${hasRisk ? "text-red-700" : "text-gray-600"}`}
      >
        {isSelected ? "Hide details" : "View details"}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${isSelected ? "rotate-180" : ""}`}
        />
      </span>
    </button>
  );
}

const SOURCE_TYPES = {
  DefectivePart: "Defective Part",
  DefectiveDOA: "Defective DOA",
  GoodPart: "Good Part",
  GoodMachine: "Good Machine",
  MismatchPart: "Mismatch Part",
  MismatchMachine: "Mismatch Machine",
};

function TypeChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all ${
        active
          ? "border-[#714b67] bg-[#714b67] text-white shadow"
          : "border-[#a6829d] bg-white text-[#714b67] hover:bg-[#714b67]/10"
      }`}
    >
      <span>{label}</span>
      <span className="font-bold">{count.toLocaleString()}</span>
    </button>
  );
}

function StatusDetails({ card }) {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null); // null = all challan types
  const [visibleRows, setVisibleRows] = useState([]); // rows left after the chips and the table filters

  useEffect(() => {
    let ignore = false; // set when another card is opened before this response arrives

    async function fetchDetails() {
      try {
        const bucket = card.key.charAt(0).toUpperCase() + card.key.slice(1);
        const res = await axiosInstance.post("LogisticDashboard/process", { type: "details", bucket });
        if (!ignore) setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        if (!ignore) toast.error(`Failed to load ${card.label} details`);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchDetails();
    return () => {
      ignore = true;
    };
  }, [card.key, card.label]);

  const typeCounts = useMemo(() => {
    const counts = new Map();
    rows.forEach((row) => counts.set(row.sourceType, (counts.get(row.sourceType) || 0) + 1));
    return Object.keys(SOURCE_TYPES)
      .filter((type) => counts.has(type))
      .map((type) => ({ type, count: counts.get(type) }));
  }, [rows]);

  const tableRows = useMemo(
    () => (selectedType ? rows.filter((row) => row.sourceType === selectedType) : rows),
    [rows, selectedType]
  );

  const columns = useMemo(
    () => [
      {
        key: "challanNo",
        label: "Challan No",
        render: (val, row) => (
          <button
            type="button"
            onClick={() =>
              router.push(
                `/logistic/history?type=${encodeURIComponent(row.sourceType)}&challanNo=${encodeURIComponent(val)}`
              )
            }
            className="cursor-pointer font-medium text-blue-600 hover:underline"
          >
            {val || "-"}
          </button>
        ),
      },
      { key: "nspName", label: "NSP Name", render: (val) => val || "-" },
      { key: "ascCode", label: "ASC Code", render: (val) => val || "-" },
      { key: "pickupBoy", label: "Courier" },
      { key: "pickupMobile", label: "Docket No" },
      { key: "challanStatus", label: "Challan Status", render: (val) => val || "-" },
      { key: "docketStatus", label: "Docket Status", render: (val) => val || "-" },
    ],
    [router]
  );

  function handleExport() {
    if (visibleRows.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      exportToExcel({
        data: visibleRows,
        headers: columns.map((c) => ({ label: c.label, key: c.key })),
        fileName: `${card.label.replace(/\s+/g, "_")}${selectedType ? `_${selectedType}` : ""}.xlsx`,
        sheetName: "Details",
      });
      toast.success("Excel downloaded");
    } catch (error) {
      console.error("Dashboard details export failed:", error);
      toast.error("Failed to export Excel");
    }
  }

  return (
    <div className={`mt-5 rounded-2xl border p-5 ${card.panel}`}>
      <p className="text-base font-semibold text-gray-800">{card.label} details</p>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {!isLoading && typeCounts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <TypeChip label="All" count={rows.length} active={selectedType === null} onClick={() => setSelectedType(null)} />
            {typeCounts.map(({ type, count }) => (
              <TypeChip
                key={type}
                label={SOURCE_TYPES[type]}
                count={count}
                active={selectedType === type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="ml-auto"
          onClick={handleExport}
          disabled={isLoading || visibleRows.length === 0}
        >
          <FileSpreadsheet size={18} className="mr-2" />
          Export Excel
        </Button>
      </div>

      <div className="mt-3">
        <LogisticTable columns={columns} rows={tableRows} isLoading={isLoading} onVisibleRowsChange={setVisibleRows} />
      </div>
    </div>
  );
}

export default function LogisticDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    fetchDashboard();

    // reopen the same card after coming back from the History page
    const key = new URLSearchParams(window.location.search).get("card");
    if (STATUS_CARDS.some((card) => card.key === key)) setSelectedKey(key);
  }, []);

  async function fetchDashboard() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("LogisticDashboard/process", { type: "summary" });
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

  const selectedCard = STATUS_CARDS.find((card) => card.key === selectedKey);

  function handleCardClick(key) {
    const next = selectedKey === key ? null : key;
    setSelectedKey(next);
    window.history.replaceState(null, "", next ? `?card=${next}` : window.location.pathname);
  }

  return (
    <PageSkeleton title="Logistic Dashboard" rolesAllowed={["logistic"]}>
      <Subheading title="Reverse Challan/Docket" />

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {STATUS_CARDS.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedKey === card.key;
          const count = isLoading ? "..." : summary ? Number(summary[card.key] ?? 0).toLocaleString() : "-";

          if (card.isAlert) {
            // "No challan at risk" only when the API really sent a zero, never while loading or after an error
            const value = isLoading ? undefined : summary?.[card.key];
            return (
              <AlertCard
                key={card.key}
                card={card}
                count={count}
                hasRisk={Number(value) > 0}
                isClear={value === 0}
                isSelected={isSelected}
                onClick={() => handleCardClick(card.key)}
              />
            );
          }

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleCardClick(card.key)}
              aria-expanded={isSelected}
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${card.tone} p-6 text-left text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 ${card.ring} ${
                isSelected ? "-translate-y-1 shadow-xl ring-4" : ""
              }`}
            >
              <Icon
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -bottom-6 h-36 w-36 text-white/15 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-base font-semibold">{card.label}</span>
                  <span className="block text-xs text-white/80">{card.hint}</span>
                </span>
              </span>
              <span className="mt-5 text-5xl font-extrabold tracking-tight tabular-nums">{count}</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-white/90">
                {isSelected ? "Hide details" : "View details"}
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-200 ${isSelected ? "rotate-180" : ""}`}
                />
              </span>
            </button>
          );
        })}
      </div>

      {selectedCard && <StatusDetails key={selectedCard.key} card={selectedCard} />}

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
