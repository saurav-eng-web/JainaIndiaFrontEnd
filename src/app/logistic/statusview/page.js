"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";

function StatusViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (type) {
      fetchData(type);
    } else {
      setIsLoading(false);
    }
  }, [type]);

  async function fetchData(statusType) {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`logistic/statusview?type=${statusType}`);
      setData(res.data || []);
    } catch (error) {
      toast.error("Failed to load status view data");
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    { 
      key: "challanNo", 
      label: "Challan No",
      render: (val, row) => (
        <button 
          onClick={() => router.push(`/logistic/history?type=${encodeURIComponent(type)}&challanNo=${encodeURIComponent(val)}`)}
          className="text-blue-600 hover:underline font-medium"
        >
          {val}
        </button>
      )
    },
    { key: "typeOfChallan", label: "Type Of Challan" },
    { key: "pickupBoy", label: "Pickup Boy" },
    { key: "pickupMobile", label: "Pickup Mobile" },
    { key: "docketStatus", label: "Docket Status" },
  ];

  return (
    <PageSkeleton title={`Status View: ${type || ""}`} rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="flex justify-between items-center">
        <Subheading title="Challan Details" />
      </div>

      <div className="mt-6">
        {!type ? (
          <div className="p-4 text-red-600 bg-red-50 rounded-md">Missing type parameter</div>
        ) : (
          <Table 
            columns={columns} 
            rows={data} 
            isLoading={isLoading} 
          />
        )}
      </div>
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
