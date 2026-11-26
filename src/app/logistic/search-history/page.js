"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * 16-Nov-2026           Aligned with the legacy Logistic/SearchHistory.aspx: the docket details and the status
 *                       history are shown on the same page after Search (no separate results grid).
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import LogisticTable from "@/components/logistic/LogisticTable";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

const SEARCH_TYPES = [
  { value: "Defective Part", label: "Defective Part" },
  { value: "Defective DOA", label: "Defective DOA" },
  { value: "Good Part", label: "Good Part" },
  { value: "Good Machine", label: "Good Machine" },
  { value: "Mismatch Part", label: "Mismatch Part" },
  { value: "Mismatch Machine", label: "Mismatch Machine" },
];

const DETAIL_FIELDS = [
  { label: "Type Of Challan", key: "typeOfChallan" },
  { label: "Challan No.", key: "challanNo" },
  { label: "Courier Code", key: "courier" },
  { label: "Docket No.", key: "docket" },
  { label: "Weight", key: "courierWeight" },
  { label: "Dimension", key: "dimensions" },
  { label: "Pickup Boy", key: "pickupBoy" },
  { label: "Mobile", key: "pickupMobile" },
  { label: "Final Status", key: "docketStatus" },
  { label: "Remark", key: "pickupRemark" },
];

const HISTORY_COLUMNS = [
  { key: "pStatus", label: "Status" },
  { key: "remark", label: "Remark" },
  { key: "tdate", label: "Date" },
];

export default function LogisticSearchHistoryPage() {
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchType || searchType === "--Select--") {
      toast.error("Please select a search type");
      return;
    }
    if (!searchValue.trim()) {
      toast.error("Please enter a challan number");
      return;
    }

    try {
      setIsLoading(true);
      setNotFound(false);

      const res = await axiosInstance.post("LogisticDocket/process", {
        type: "search",
        challanType: searchType,
        challanNo: searchValue.trim(),
      });
      setDetail(res.data?.data || null);
      setNotFound(!res.data?.data);
    } catch (error) {
      setDetail(null);
      if (error?.response?.status === 404) {
        setNotFound(true);
        toast.error("No result found");
      } else {
        toast.error(error?.response?.data?.statusMsg || "Search failed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageSkeleton title="Search History" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <Subheading title="Search Criteria" />
        <form onSubmit={handleSearch} className="mt-4 flex flex-col items-end gap-4 sm:flex-row">
          <div className="w-full flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pickup Type <span className="text-red-500">*</span>
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">--Select--</option>
              {SEARCH_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Challan No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter challan number"
              className="h-10 w-full rounded-md border border-gray-300 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-auto">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {DETAIL_FIELDS.map((f) => (
            <div key={f.key} className="flex gap-2 text-sm">
              <span className="min-w-[8.5rem] font-semibold text-[#003366]">{f.label}</span>
              <span className="break-words text-gray-800">{detail ? detail[f.key] || "" : ""}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Subheading title="History" />
        <div className="mt-4">
          <LogisticTable columns={HISTORY_COLUMNS} rows={detail?.history || []} isLoading={isLoading} />
          {!isLoading && notFound && (
            <div className="mt-4 rounded border border-dashed p-4 text-center text-gray-500">No result found</div>
          )}
        </div>
      </div>
    </PageSkeleton>
  );
}
