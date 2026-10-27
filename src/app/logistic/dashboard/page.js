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
import Table from "@/components/common/Table";

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

  const courierCols = [
    { key: "courierName", label: "Courier" },
    { key: "avi", label: "Available Dockets" }
  ];

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

      <div className="mt-12">
        <Subheading title="Courier Availability" />
        <div className="mt-6 max-w-2xl">
          <Table 
            columns={courierCols} 
            rows={summary?.courierAvailability || []} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </PageSkeleton>
  );
}
