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

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import { pick } from "@/components/logistic/rowUtils";

/*
 * Legacy Mob/PrintDefectiveChallanho.aspx:
 * ASClistm(@Role='LOG') service centers + PrintChallanListm(@SfId,@Type,@Month,@Year).
 * Grid: Challan No. (ponumber, link to ../mob/pdefinvoice.aspx -> delivery challan), SF Name, Challan Date, Doc. No.
 */
const CHALLAN_TYPES = [
  { value: "Defective", label: "Defective", printType: "Defective" },
  { value: "DOA", label: "DOA", printType: "DOA" },
  { value: "GoodSpare", label: "Good Spare", printType: "goodspare" },
  { value: "GoodFG", label: "GoodFG", printType: "GoodFG" },
  { value: "MisFG", label: "Mis. Challan", printType: "MisFG" },
  { value: "MisSpare", label: "Mis. Challan Spare", printType: "MisSpare" },
];

const MONTHS = [
  { value: 1, label: "Jan" }, { value: 2, label: "Feb" }, { value: 3, label: "March" }, { value: 4, label: "Apr" },
  { value: 5, label: "May" }, { value: 6, label: "June" }, { value: 7, label: "July" }, { value: 8, label: "Aug" },
  { value: 9, label: "Sept" }, { value: 10, label: "Oct" }, { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
];

// Legacy offered the current year and the previous four.
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [0, 1, 2, 3, 4].map((n) => CURRENT_YEAR - n);

const SELECT_CLASS =
  "w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function LogisticMobilePrintChallanPage() {
  const [ascList, setAscList] = useState([]);
  const [isAscLoading, setIsAscLoading] = useState(true);
  const [sfId, setSfId] = useState("");
  const [challanType, setChallanType] = useState("Defective");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(CURRENT_YEAR);

  const [data, setData] = useState([]);
  const [printType, setPrintType] = useState("Defective");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await axiosInstance.get("logistic/mobile/asclist");
        if (!cancelled) setAscList(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        if (!cancelled) toast.error(error?.response?.data?.message || "Failed to load service center list");
      } finally {
        if (!cancelled) setIsAscLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!sfId) {
      toast.error("Please select a service center");
      return;
    }
    const type = CHALLAN_TYPES.find((t) => t.value === challanType) || CHALLAN_TYPES[0];
    try {
      setIsLoading(true);
      setHasSearched(true);
      const res = await axiosInstance.get("logistic/mobile/challans", {
        params: { sfId, challanType: type.value, month, year },
      });
      setData(Array.isArray(res.data) ? res.data : []);
      setPrintType(type.printType);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search challans");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  function openPrint(poNo) {
    if (!poNo) return;
    window.open(
      `/logistic/mobile/print?poNo=${encodeURIComponent(poNo)}&type=${encodeURIComponent(printType)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const columns = [
    {
      key: "challan",
      label: "Challan No.",
      render: (_, row) => {
        const poNo = pick(row, "ponumber");
        return poNo ? (
          <button type="button" onClick={() => openPrint(poNo)} className="text-blue-600 hover:underline font-semibold">
            {poNo}
          </button>
        ) : (
          "-"
        );
      },
    },
    { key: "sfname", label: "SF Name", size: "lg", render: (_, row) => pick(row, "sfname") || "-" },
    { key: "date", label: "Challan Date", render: (_, row) => pick(row, "date") || "-" },
    { key: "status", label: "Doc. No.", render: (_, row) => pick(row, "status") || "-" },
  ];

  return (
    <PageSkeleton title="Mobile Print Challan" rolesAllowed={["logistic"]} backHref="/logistic/print">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Search Challans" />
        <form onSubmit={handleSearch} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Center <span className="text-red-500">*</span>
            </label>
            <select value={sfId} onChange={(e) => setSfId(e.target.value)} disabled={isAscLoading} className={SELECT_CLASS}>
              <option value="">{isAscLoading ? "Loading..." : "--Select Service Center--"}</option>
              {ascList.map((asc, idx) => {
                const id = String(pick(asc, "ASC_id", "ascintcode"));
                return (
                  <option key={`${id}-${idx}`} value={id}>
                    {pick(asc, "asc_name")}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challan Type <span className="text-red-500">*</span>
            </label>
            <select value={challanType} onChange={(e) => setChallanType(e.target.value)} className={SELECT_CLASS}>
              {CHALLAN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={SELECT_CLASS}>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={SELECT_CLASS}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      {(hasSearched || isLoading) && (
        <div>
          <Subheading title="Challan List" />
          <div className="mt-4">
            <Table columns={columns} rows={data} isLoading={isLoading} />
          </div>
        </div>
      )}
    </PageSkeleton>
  );
}
