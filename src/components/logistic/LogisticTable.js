"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 20-Nov-2026  Saurav   Created for Logistic Module: table with sorting and a filter box under every column
 *                       header, 50 rows per page, and scrolling inside the table only (the page itself does
 *                       not scroll). Same props as the common Table.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";

import Loading from "@/components/customui/Loading";

export const LOGISTIC_PAGE_SIZE = 50;

const sizeMap = {
  xxs: "w-10 max-w-[5rem]",
  xs: "w-20 max-w-[5rem]",
  sm: "w-28 max-w-[7rem]",
  md: "w-36 max-w-[9rem]",
  lg: "w-48 max-w-[12rem]",
  xl: "w-64 max-w-[16rem]",
  xxl: "w-80 max-w-[20rem]",
  xxxl: "w-96 max-w-[24rem]",
  full: "",
};

function cellText(value) {
  if (value === null || value === undefined || typeof value === "object") return "";
  return String(value);
}

// Numbers are compared as numbers, everything else as text (numeric aware, case insensitive)
function compareValues(a, b) {
  const x = cellText(a);
  const y = cellText(b);
  const nx = Number(x);
  const ny = Number(y);
  if (x !== "" && y !== "" && !Number.isNaN(nx) && !Number.isNaN(ny)) return nx - ny;
  return x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" });
}

const NAV_BUTTON =
  "rounded-md border border-[#a6829d] px-3 py-1 text-sm text-[#714b67] transition-colors hover:bg-[#714b67] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#714b67]";

/**
 * Same props as the common Table, plus:
 *  - pageSize             rows per page (default 50)
 *  - maxHeightClass       the table body scrolls inside this height; the header stays on top
 *  - filterable           show the filter boxes under the column headers (default true)
 *  - onVisibleRowsChange  called with the rows that match the filters, in the sorted order (used for Export Excel)
 * A column can opt out with `filterable: false`. Columns that only render buttons (no data field) get no sort or filter.
 */
export default function LogisticTable({
  columns,
  rows,
  isLoading = false,
  onRowClick,
  pageSize = LOGISTIC_PAGE_SIZE,
  maxHeightClass = "max-h-[60vh]",
  filterable = true,
  onVisibleRowsChange,
}) {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const allRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

  // Callers usually build `columns` inside the component, so it is a new array on every render. It must not
  // drive the memos below (that would change the visible rows on every render and loop with onVisibleRowsChange).
  // Only the column keys / filterable flags matter, so they are turned into a text signature.
  const columnSignature = columns.map((col) => `${col.key}:${col.filterable === false ? 0 : 1}`).join("|");

  // Columns that show a data field of the row can be sorted and filtered
  const dataKeys = useMemo(() => {
    const sample = allRows.slice(0, 25);
    const keys = new Set();
    columnSignature.split("|").forEach((entry) => {
      const [key, canFilter] = [entry.slice(0, entry.lastIndexOf(":")), entry.slice(entry.lastIndexOf(":") + 1)];
      if (canFilter === "0") return;
      if (sample.some((row) => row && typeof row === "object" && key in row)) keys.add(key);
    });
    return keys;
  }, [columnSignature, allRows]);

  const activeFilters = useMemo(
    () => Object.entries(filters).filter(([key, text]) => text.trim() !== "" && dataKeys.has(key)),
    [filters, dataKeys]
  );

  const visibleRows = useMemo(() => {
    let result = allRows;
    if (activeFilters.length > 0) {
      result = result.filter((row) =>
        activeFilters.every(([key, text]) => cellText(row?.[key]).toLowerCase().includes(text.trim().toLowerCase()))
      );
    }
    if (sort.key && dataKeys.has(sort.key)) {
      const direction = sort.dir === "desc" ? -1 : 1;
      result = [...result].sort((a, b) => direction * compareValues(a?.[sort.key], b?.[sort.key]));
    }
    return result;
  }, [allRows, activeFilters, sort, dataKeys]);

  useEffect(() => {
    onVisibleRowsChange?.(visibleRows);
  }, [visibleRows, onVisibleRowsChange]);

  // Back to the first page when the filters or the data set change
  useEffect(() => {
    setPage(1);
  }, [filters, sort, allRows.length]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * pageSize;
  const pageRows = visibleRows.slice(firstIndex, firstIndex + pageSize);

  const showFilterRow = filterable && dataKeys.size > 0 && (allRows.length > 10 || activeFilters.length > 0);
  const showPager = visibleRows.length > pageSize;

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" }; // third click clears the sort
    });
  }

  function sortArrow(key) {
    if (sort.key !== key) return "⇅";
    return sort.dir === "asc" ? "▲" : "▼";
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className={`overflow-auto ${maxHeightClass}`}>
          <table className="w-full table-auto text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#714b67] text-slate-100">
              <tr className="h-12">
                {columns.map((col) => {
                  const sortable = dataKeys.has(col.key);
                  return (
                    <th
                      key={col.key}
                      className={`px-2 py-2 text-left text-[14px] font-semibold whitespace-nowrap ${sizeMap[col.size] || sizeMap.md}`}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className="flex cursor-pointer items-center gap-1 font-semibold"
                          title="Click to sort"
                        >
                          <span className="truncate">{col.label}</span>
                          <span className={`text-[10px] ${sort.key === col.key ? "opacity-100" : "opacity-50"}`}>
                            {sortArrow(col.key)}
                          </span>
                        </button>
                      ) : (
                        <span className="truncate">{col.label}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
              {showFilterRow && (
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-2 pb-2 font-normal">
                      {dataKeys.has(col.key) ? (
                        <input
                          type="text"
                          value={filters[col.key] || ""}
                          onChange={(e) => setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))}
                          placeholder="Filter"
                          className="h-7 w-full min-w-[4rem] rounded border border-[#a6829d] bg-white px-2 text-xs font-normal text-gray-800 outline-none focus:ring-1 focus:ring-white"
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="p-10">
                    <div className="flex h-full w-full items-center justify-center">
                      <Loading />
                    </div>
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-slate-500">
                    {activeFilters.length > 0 ? "No matching records" : "No data"}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, rowIndex) => (
                  <tr
                    key={firstIndex + rowIndex}
                    className={`transition-colors hover:bg-slate-100 ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-2 py-4 align-top wrap-break-word whitespace-normal text-slate-600 ${sizeMap[col.size] || sizeMap.md}`}
                      >
                        {col.render ? col.render(row?.[col.key], row, rowIndex) : row?.[col.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(showPager || activeFilters.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
          <span>
            {visibleRows.length === 0
              ? "0 records"
              : `Showing ${(firstIndex + 1).toLocaleString()} - ${Math.min(firstIndex + pageSize, visibleRows.length).toLocaleString()} of ${visibleRows.length.toLocaleString()}${
                  activeFilters.length > 0 ? ` (filtered from ${allRows.length.toLocaleString()})` : ""
                }`}
          </span>
          {showPager && (
            <div className="flex items-center gap-2">
              <button type="button" className={NAV_BUTTON} disabled={currentPage === 1} onClick={() => setPage(1)}>
                First
              </button>
              <button type="button" className={NAV_BUTTON} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                Previous
              </button>
              <span className="px-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className={NAV_BUTTON}
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
              <button
                type="button"
                className={NAV_BUTTON}
                disabled={currentPage === totalPages}
                onClick={() => setPage(totalPages)}
              >
                Last
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
