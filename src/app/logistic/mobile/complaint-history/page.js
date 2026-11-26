"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import LogisticTable from "@/components/logistic/LogisticTable";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { columnsFromRows } from "@/components/logistic/rowUtils";

const SECTIONS = [
  { key: "customer", title: "Customer Details" },
  { key: "customerAddress", title: "Customer Address" },
  { key: "product", title: "Product Details" },
  { key: "complaint", title: "Complaint Details" },
  { key: "complaintDetail", title: "Complaint Status" },
  { key: "history", title: "History" },
  { key: "documents", title: "Supporting Documents" },
];

function ComplaintHistoryContent() {
  const searchParams = useSearchParams();
  const ticketKey = searchParams.get("ticketKey");

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ticketKey) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await axiosInstance.post("LogisticMobile/process", { type: "complaintHistory", ticketKey });
        if (!cancelled) setData(res.data?.data ?? null);
      } catch (error) {
        if (!cancelled) toast.error(error?.response?.data?.statusMsg || "Failed to load complaint history");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [ticketKey]);

  return (
    <PageSkeleton title="Mobile Complaint History" rolesAllowed={["logistic"]} backHref="/logistic/mobile/complaint-search">
      {!ticketKey ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">Missing ticket key</div>
      ) : isLoading ? (
        <div className="p-4 text-gray-600">Loading...</div>
      ) : !data ? (
        <div className="p-4 text-gray-600">No result found</div>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map((section) => {
            const rows = Array.isArray(data[section.key]) ? data[section.key] : [];
            if (rows.length === 0) return null;
            return (
              <div key={section.key}>
                <Subheading title={section.title} />
                <div className="mt-3">
                  <LogisticTable columns={columnsFromRows(rows)} rows={rows} isLoading={false} />
                </div>
              </div>
            );
          })}
          {SECTIONS.every((s) => !Array.isArray(data[s.key]) || data[s.key].length === 0) && (
            <div className="p-4 text-gray-600">No result found</div>
          )}
        </div>
      )}
    </PageSkeleton>
  );
}

export default function LogisticMobileComplaintHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComplaintHistoryContent />
    </Suspense>
  );
}
