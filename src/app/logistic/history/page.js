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
import { useSearchParams } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";

function HistoryContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const challanNo = searchParams.get("challanNo");
  
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (type && challanNo) {
      fetchHistory(type, challanNo);
    } else {
      setIsLoading(false);
    }
  }, [type, challanNo]);

  async function fetchHistory(statusType, cNo) {
    try {
      setIsLoading(true);
      // Legacy History.aspx: sp_DocketDetails header + PickUPhistory grid. The API maps the
      // StatusView code (e.g. DefectivePart) to the display name the SP expects.
      const res = await axiosInstance.get(`logistic/dockets/history`, {
        params: { type: statusType, challanNo: cNo },
      });
      setDetail(res.data);
    } catch (error) {
      setDetail(null);
      if (error?.response?.status === 404) {
        toast.error("No result found");
      } else {
        toast.error(error?.response?.data?.message || "Failed to load docket history");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const historyCols = [
    { key: "pStatus", label: "Status" },
    { key: "remark", label: "Remark" },
    { key: "tdate", label: "Date" },
  ];

  return (
    <PageSkeleton title="Docket History" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="flex justify-between items-center mb-6">
        <Subheading title={`Challan: ${challanNo || ""}`} />
      </div>

      {!type || !challanNo ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">Missing type or challanNo parameter</div>
      ) : isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : detail ? (
        <div className="space-y-8">
          {/* DETAIL CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Docket Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Challan No</p>
                <p className="font-medium">{detail.challanNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Docket</p>
                <p className="font-medium">{detail.docket}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courier</p>
                <p className="font-medium">{detail.courier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type Of Challan</p>
                <p className="font-medium">{detail.typeOfChallan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courier Weight</p>
                <p className="font-medium">{detail.courierWeight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dimensions</p>
                <p className="font-medium">{detail.dimensions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Boy</p>
                <p className="font-medium">{detail.pickupBoy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Mobile</p>
                <p className="font-medium">{detail.pickupMobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Docket Status</p>
                <p className="font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {detail.docketStatus}
                  </span>
                </p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-500">Pickup Remark</p>
                <p className="font-medium">{detail.pickupRemark}</p>
              </div>
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status History</h3>
            <Table 
              columns={historyCols} 
              rows={detail.history || []} 
              isLoading={false} 
            />
          </div>
        </div>
      ) : (
        <div className="p-4 text-gray-600">No result found</div>
      )}
    </PageSkeleton>
  );
}

export default function LogisticHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}
