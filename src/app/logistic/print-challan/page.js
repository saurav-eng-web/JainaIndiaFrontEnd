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
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";

/*
 * Legacy pages (C:\Old Porject Code\09112025\Logistic):
 *  - PrintDefectiveChallan.aspx     -> "defective"   : ASClist(@Role='LOG') + PrintChallanList(@SfId,@Type,@Month,@Year)
 *  - PrintDOADefectiveChallan.aspx  -> "doa"         : ASC_MASTER, filtered by ASC name
 *  - PrintGoodChallan.aspx          -> "good"        : ASC_MASTER, filtered by ASC name (Tbl_GudPOMaster)
 *  - PrintGoodChallanMachine.aspx   -> "goodmachine" : ASC_MASTER, filtered by ASC name
 *  - PrintMisChallan.aspx           -> "mis"         : ASC_MASTER, filtered by ASC name
 *  - PrintMisChallanFG.aspx         -> "misfg"       : SF id
 * Each legacy row linked to the shared ../Print/*Invoice*.aspx pages, which show an ASC copy and an
 * NSP copy; the new app serves those through /print-asc and /print-nsp (Print/fetch).
 */
const CHALLAN_TYPES = [
  { value: "defective", label: "Defective Challan", ascSource: "LOG" },
  { value: "doa", label: "Defective DOA Challan", ascSource: "ALL" },
  { value: "good", label: "Good Part Challan", ascSource: "ALL" },
  { value: "goodmachine", label: "Good Machine Challan", ascSource: "ALL" },
  { value: "mis", label: "Mismatch Part Challan", ascSource: "ALL" },
  { value: "misfg", label: "Mismatch Machine Challan", ascSource: "ALL" },
];

// Legacy PrintDefectiveChallan.aspx "Challan Type" dropdown -> PrintChallanList @Type
const DEFECTIVE_SUB_TYPES = [
  { value: "Defective", label: "Defective", printType: "Defective" },
  { value: "DOA", label: "DOA", printType: "DOA" },
  { value: "GoodSpare", label: "Good Spare", printType: "goodspare" },
  { value: "GoodFG", label: "GoodFG", printType: "GoodFG" },
  { value: "MisFG", label: "Mis. Challan", printType: "MisFG" },
  { value: "MisSpare", label: "Mis. Challan Spare", printType: "MisSpare" },
];

// Print/fetch "challantype" used for the print links of the other legacy pages
const PRINT_TYPE_BY_PAGE = {
  doa: "DOA",
  good: "goodspare",
  goodmachine: "GoodFG",
  mis: "MisSpare",
  misfg: "MisFG",
};

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2018 + 1 }, (_, i) => 2018 + i).reverse();

const SELECT_CLASS =
  "w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function PrintChallanPage() {
  const [ascLists, setAscLists] = useState({ LOG: null, ALL: null });
  const [isAscLoading, setIsAscLoading] = useState(false);

  const [selectedAsc, setSelectedAsc] = useState("");
  const [selectedType, setSelectedType] = useState("defective");
  const [selectedSubType, setSelectedSubType] = useState("Defective");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const [data, setData] = useState([]);
  const [resultMeta, setResultMeta] = useState({ type: "defective", printType: "Defective" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const typeConfig = CHALLAN_TYPES.find((t) => t.value === selectedType) || CHALLAN_TYPES[0];
  const ascSource = typeConfig.ascSource;
  const ascList = ascLists[ascSource] || [];

  useEffect(() => {
    if (ascLists[ascSource]) return;

    let cancelled = false;
    async function fetchAscList() {
      try {
        setIsAscLoading(true);
        const res = await axiosInstance.get("logistic/challans/asclist", {
          params: ascSource === "LOG" ? { role: "LOG" } : {},
        });
        if (!cancelled) setAscLists((prev) => ({ ...prev, [ascSource]: res.data || [] }));
      } catch (error) {
        if (!cancelled) toast.error(error?.response?.data?.message || "Failed to load service center list");
      } finally {
        if (!cancelled) setIsAscLoading(false);
      }
    }
    fetchAscList();
    return () => {
      cancelled = true;
    };
  }, [ascSource, ascLists]);

  function handleTypeChange(value) {
    setSelectedType(value);
    setSelectedAsc("");
    setData([]);
    setHasSearched(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!selectedAsc) {
      toast.error("Please select a service center");
      return;
    }

    const asc = ascList.find((a) => a.ascIntCode === selectedAsc);
    const subType = DEFECTIVE_SUB_TYPES.find((s) => s.value === selectedSubType) || DEFECTIVE_SUB_TYPES[0];

    const params = { month: selectedMonth, year: selectedYear };
    if (selectedType === "defective") {
      params.sfId = selectedAsc;
      params.challanType = subType.value;
    } else if (selectedType === "misfg") {
      params.sfId = selectedAsc;
    } else {
      params.ascName = asc?.ascName || "";
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      const res = await axiosInstance.get(`logistic/challans/${selectedType}`, { params });
      setData(Array.isArray(res.data) ? res.data : []);
      setResultMeta({
        type: selectedType,
        printType: selectedType === "defective" ? subType.printType : PRINT_TYPE_BY_PAGE[selectedType],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search challans");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  function openPrint(copy, challanNo) {
    if (!challanNo) return;
    const path = copy === "nsp" ? "/print-nsp" : "/print-asc";
    const url = `${path}?type=${copy}&pono=${encodeURIComponent(challanNo)}&challantype=${encodeURIComponent(resultMeta.printType)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function challanColumn(key, label) {
    return {
      key,
      label,
      size: "md",
      render: (val) =>
        val ? (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-800">{val}</span>
            <div className="flex gap-3 text-xs">
              <button type="button" onClick={() => openPrint("asc", val)} className="text-blue-600 hover:underline">
                ASC Copy
              </button>
              <button type="button" onClick={() => openPrint("nsp", val)} className="text-blue-600 hover:underline">
                NSP Copy
              </button>
            </div>
          </div>
        ) : (
          "-"
        ),
    };
  }

  // Columns follow each legacy grid.
  function getColumns(type) {
    switch (type) {
      case "defective":
        return [
          challanColumn("poNumber", "Challan No."),
          { key: "sfName", label: "SF Name", size: "lg" },
          { key: "date", label: "Challan Date" },
          { key: "status", label: "Doc. No." },
        ];
      case "doa":
        return [
          challanColumn("poNumber", "DC No."),
          { key: "sfName", label: "SF Name", size: "lg" },
          { key: "date", label: "DC Date" },
          { key: "status", label: "Doc. No." },
        ];
      case "good":
        return [
          challanColumn("gudNo", "DC No."),
          { key: "gudDate", label: "Good Date" },
          { key: "gudDocNo", label: "Doc. No." },
          { key: "gudRemark", label: "Remark", size: "lg" },
        ];
      case "goodmachine":
        return [
          { key: "id", label: "ID", size: "sm" },
          challanColumn("poNo", "PO No."),
          { key: "product", label: "Product" },
          { key: "model", label: "Model" },
          { key: "serialNo", label: "SR No." },
          { key: "ticketNo", label: "Ticket No." },
        ];
      case "mis":
        return [
          challanColumn("misNo", "DC No."),
          { key: "misDate", label: "Date" },
          { key: "misDocNo", label: "Doc. No." },
          { key: "misRemark", label: "Remark", size: "lg" },
        ];
      case "misfg":
        return [
          challanColumn("poNo", "DC No."),
          { key: "product", label: "Product" },
          { key: "model", label: "Model" },
          { key: "ticketNo", label: "Ticket No.", size: "lg" },
          { key: "serialNo", label: "Serial No." },
        ];
      default:
        return [];
    }
  }

  const columns = getColumns(resultMeta.type);

  return (
    <PageSkeleton title="Print Challan" rolesAllowed={["logistic"]} backHref="/logistic/print">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Search Challans" />
        <form onSubmit={handleSearch} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challan <span className="text-red-500">*</span>
            </label>
            <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)} className={SELECT_CLASS}>
              {CHALLAN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {selectedType === "defective" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Challan Type <span className="text-red-500">*</span>
              </label>
              <select value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)} className={SELECT_CLASS}>
                {DEFECTIVE_SUB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Center <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAsc}
              onChange={(e) => setSelectedAsc(e.target.value)}
              disabled={isAscLoading}
              className={SELECT_CLASS}
            >
              <option value="">{isAscLoading ? "Loading..." : "--Select Service Center--"}</option>
              {ascList.map((asc) => (
                <option key={asc.ascIntCode} value={asc.ascIntCode}>{asc.ascName}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className={SELECT_CLASS}>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className={SELECT_CLASS}>
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
