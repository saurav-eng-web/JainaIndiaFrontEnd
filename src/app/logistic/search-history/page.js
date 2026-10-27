"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";

const SEARCH_TYPES = [
  { value: "Defective Part", label: "Defective Part" },
  { value: "Defective DOA", label: "Defective DOA" },
  { value: "Good Part", label: "Good Part" },
  { value: "Good Machine", label: "Good Machine" },
  { value: "Mismatch Part", label: "Mismatch Part" },
  { value: "Mismatch Machine", label: "Mismatch Machine" },
];

export default function LogisticSearchHistoryPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      setHasSearched(true);
      
      // Legacy SearchHistory.aspx: sp_DocketDetailsSearch(@Type=<dropdown text>, @PONo=<challan>)
      // returns a single docket header; the API responds 404 "No result found" when nothing matches.
      const res = await axiosInstance.get(`logistic/dockets/search`, {
        params: {
          type: searchType,
          challanNo: searchValue.trim()
        }
      });

      setData(res.data ? [res.data] : []);
    } catch (error) {
      setData([]);
      if (error?.response?.status === 404) {
        toast.error("No result found");
      } else {
        toast.error(error?.response?.data?.message || "Search failed");
      }
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
          onClick={() => router.push(`/logistic/history?type=${encodeURIComponent(searchType)}&challanNo=${encodeURIComponent(val)}`)}
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
    <PageSkeleton title="Search Docket History" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      {/* Mobile Complaint Search Quick Access */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Looking for Mobile Complaints?</h4>
            <p className="text-xs text-gray-600">Search customer tickets, reminders, and mobile complaints.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/logistic/mobile/complaint-search")}
          className="shrink-0 bg-white hover:bg-blue-50"
        >
          Go to Mobile Complaint Search &rarr;
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Search Criteria" />
        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Type <span className="text-red-500">*</span>
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">--Select--</option>
              {SEARCH_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challan No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter challan number"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-auto">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      {(hasSearched || isLoading) && (
        <div>
          <Subheading title="Search Results" />
          <div className="mt-4">
            <Table 
              columns={columns} 
              rows={data} 
              isLoading={isLoading} 
            />
            {!isLoading && data.length === 0 && (
              <div className="text-center text-gray-500 mt-4 p-4 border border-dashed rounded">
                No result found
              </div>
            )}
          </div>
        </div>
      )}
    </PageSkeleton>
  );
}
