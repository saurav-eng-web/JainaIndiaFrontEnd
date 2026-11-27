"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, Clock, FileSpreadsheet, PackageCheck, TriangleAlert, Truck } from "lucide-react";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import Subheading from "@/components/customui/Subheading";
import LogisticTable from "@/components/logistic/LogisticTable";
import { exportToExcel } from "@/utils/exportToExcel";

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
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 ${frame} p-4 pt-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 ${
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
        className={`pointer-events-none absolute -right-4 -bottom-5 h-24 w-24 transition-transform duration-300 group-hover:scale-110 ${
          hasRisk ? "text-red-600/10" : "text-gray-400/10"
        }`}
      />
      <span className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
            hasRisk ? "bg-red-600" : "bg-gray-400"
          }`}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className={`block text-base font-bold ${hasRisk ? "text-red-800" : "text-gray-700"}`}>
          {card.label}
        </span>
      </span>
      <span className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`text-3xl font-extrabold tracking-tight tabular-nums ${hasRisk ? "text-red-700" : "text-gray-700"}`}
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
            {card.clearText || "No challan at risk"}
          </span>
        )}
      </span>
      <span
        className={`mt-2 flex items-center gap-1 text-sm font-semibold ${hasRisk ? "text-red-700" : "text-gray-600"}`}
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

/**
 * Table columns come from the procedure result: same names, same order, so a column added in SQL shows up
 * without any API or UI change. Names starting with "_" are hidden (helper values such as _SourceType).
 * renderers: optional special cell for a column name (e.g. the clickable Challan No).
 */
export function columnsFromResult(rows, renderers = {}) {
  if (!rows.length) return [];
  return Object.keys(rows[0])
    .filter((name) => !name.startsWith("_"))
    .map((name) => ({ key: name, label: name, render: renderers[name] ?? ((value) => value || "-") }));
}

export function ResultTable({ columns, rows, isLoading, ...tableProps }) {
  if (columns.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        {isLoading ? "Loading..." : "No data"}
      </div>
    );
  }
  return <LogisticTable columns={columns} rows={rows} isLoading={isLoading} {...tableProps} />;
}

function StatusDetails({ card, endpoint, linkChallan, onChallanClick, filePrefix }) {
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
        const res = await axiosInstance.post(endpoint, { type: "details", bucket });
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
  }, [card.key, card.label, endpoint]);

  const typeCounts = useMemo(() => {
    const counts = new Map();
    rows.forEach((row) => counts.set(row._SourceType, (counts.get(row._SourceType) || 0) + 1));
    return Object.keys(SOURCE_TYPES)
      .filter((type) => counts.has(type))
      .map((type) => ({ type, count: counts.get(type) }));
  }, [rows]);

  const tableRows = useMemo(
    () => (selectedType ? rows.filter((row) => row._SourceType === selectedType) : rows),
    [rows, selectedType]
  );

  const columns = useMemo(
    () =>
      columnsFromResult(rows, {
        // the column named "Challan No" is the clickable one
        "Challan No": (val, row) =>
          (linkChallan || onChallanClick) && val ? (
            <button
              type="button"
              onClick={() =>
                onChallanClick
                  ? onChallanClick(val)
                  : router.push(
                      `/logistic/history?type=${encodeURIComponent(row._SourceType)}&challanNo=${encodeURIComponent(val)}`
                    )
              }
              className="cursor-pointer font-medium text-blue-600 hover:underline"
            >
              {val}
            </button>
          ) : (
            <span className="font-medium text-gray-800">{val || "-"}</span>
          ),
      }),
    [rows, router, linkChallan, onChallanClick]
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
        fileName: `${filePrefix}${card.label.replace(/\s+/g, "_")}${selectedType ? `_${selectedType}` : ""}.xlsx`,
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
        <ResultTable columns={columns} rows={tableRows} isLoading={isLoading} onVisibleRowsChange={setVisibleRows} />
      </div>
    </div>
  );
}

/**
 * Challan/Docket status cards with the details table of the clicked card.
 * The defaults are the "Reverse Challan/Docket" section; other sections pass their own title, cards and queryKey.
 * summary / isLoading come from the page; endpoint is the API used for the details list.
 * queryKey is the URL parameter that remembers the open card, so two sections do not disturb each other.
 */
export default function ReverseChallanBoard({
  summary,
  isLoading,
  endpoint,
  linkChallan = false,
  onChallanClick,
  title = "Reverse Challan/Docket",
  cards = STATUS_CARDS,
  queryKey = "card",
  filePrefix = "",
  onOpenChange, // told true while a card is open; pass a stable function (e.g. a state setter)
}) {
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    onOpenChange?.(selectedKey !== null);
  }, [selectedKey, onOpenChange]);

  useEffect(() => {
    // reopen the same card after a reload or after coming back from the History page
    const key = new URLSearchParams(window.location.search).get(queryKey);
    if (cards.some((card) => card.key === key)) setSelectedKey(key);
  }, [cards, queryKey]);

  const selectedCard = cards.find((card) => card.key === selectedKey);

  function handleCardClick(key) {
    const next = selectedKey === key ? null : key;
    setSelectedKey(next);

    const params = new URLSearchParams(window.location.search);
    if (next) params.set(queryKey, next);
    else params.delete(queryKey);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  return (
    <>
      <Subheading title={title} />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
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
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${card.tone} p-4 text-left text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 ${card.ring} ${
                isSelected ? "-translate-y-1 shadow-xl ring-4" : ""
              }`}
            >
              <Icon
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -bottom-5 h-24 w-24 text-white/15 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-semibold">{card.label}</span>
                  <span className="block text-xs text-white/80">{card.hint}</span>
                </span>
              </span>
              <span className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">{count}</span>
              <span className="mt-2 flex items-center gap-1 text-sm font-medium text-white/90">
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

      {selectedCard && (
        <StatusDetails
          key={selectedCard.key}
          card={selectedCard}
          endpoint={endpoint}
          linkChallan={linkChallan}
          onChallanClick={onChallanClick}
          filePrefix={filePrefix}
        />
      )}
    </>
  );
}

