"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * 20-Nov-2026  Saurav   All challans load on open. Title on its own line; below it one line with the small Docket
 *                       Status count cards (click one to filter the table, click it again or "All" to clear) and
 *                       Export Excel on the right. Sorting and filters are in the table header, the table has its own scroller and
 *                       50 rows per page. Column labels follow the Status View SP (PickupBoy = courier name,
 *                       PickupMobile = docket number).
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState, Suspense } from "react";
import { FileSpreadsheet } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import LogisticTable from "@/components/logistic/LogisticTable";
import { exportToExcel } from "@/utils/exportToExcel";

function normalizeStatus(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Not Set";
  return /^in[\s-]?transit$/i.test(text) ? "In-Transit" : text;
}

function StatusCard({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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

function StatusViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null); // null = all challans
  const [visibleRows, setVisibleRows] = useState([]); // rows left after the card and the table filters

  useEffect(() => {
    setSelectedStatus(null);
    if (type) {
      fetchData(type);
    } else {
      setIsLoading(false);
    }
  }, [type]);

  async function fetchData(statusType) {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("logistic/statusview/process", { type: statusType });
      setData(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      setData([]);
      toast.error("Failed to load status view data");
    } finally {
      setIsLoading(false);
    }
  }

  const statusCards = useMemo(() => {
    const counts = new Map();
    data.forEach((row) => {
      const key = normalizeStatus(row.docketStatus);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count);
  }, [data]);

  const tableRows = useMemo(
    () => (selectedStatus ? data.filter((row) => normalizeStatus(row.docketStatus) === selectedStatus) : data),
    [data, selectedStatus]
  );

  const columns = useMemo(
    () => [
      {
        key: "challanNo",
        label: "Challan No",
        render: (val) => (
          <button
            onClick={() => router.push(`/logistic/history?type=${encodeURIComponent(type)}&challanNo=${encodeURIComponent(val)}`)}
            className="text-blue-600 hover:underline font-medium"
          >
            {val}
          </button>
        ),
      },
      { key: "typeOfChallan", label: "Type Of Challan" },
      { key: "pickupBoy", label: "Courier" },
      { key: "pickupMobile", label: "Docket No" },
      { key: "challanStatus", label: "Challan Status", render: (val) => val || "-" },
      { key: "docketStatus", label: "Docket Status", render: (val) => val || "-" },
    ],
    [router, type]
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
        fileName: `StatusView_${type}${selectedStatus ? `_${selectedStatus}` : ""}.xlsx`,
        sheetName: "StatusView",
      });
      toast.success("Excel downloaded");
    } catch (error) {
      console.error("Status view export failed:", error);
      toast.error("Failed to export Excel");
    }
  }

  return (
    <PageSkeleton title={`Status View: ${type || ""}`} rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      {!type ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">Missing type parameter</div>
      ) : (
        <>
          <Subheading title="Challan Details" />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {!isLoading && statusCards.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <StatusCard label="All" count={data.length} active={selectedStatus === null} onClick={() => setSelectedStatus(null)} />
                {statusCards.map((card) => (
                  <StatusCard
                    key={card.status}
                    label={card.status}
                    count={card.count}
                    active={card.status === selectedStatus}
                    onClick={() => setSelectedStatus(card.status === selectedStatus ? null : card.status)}
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
            <LogisticTable
              columns={columns}
              rows={tableRows}
              isLoading={isLoading}
              maxHeightClass="max-h-[calc(100vh-390px)] min-h-[240px]"
              onVisibleRowsChange={setVisibleRows}
            />
          </div>
        </>
      )}
    </PageSkeleton>
  );
}

export default function LogisticStatusViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusViewContent />
    </Suspense>
  );
}
