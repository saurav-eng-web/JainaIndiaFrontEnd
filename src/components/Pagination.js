"use client";

import { useState } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  setPageSize,
  setCurrentPage,
}) {
  const [jumpPage, setJumpPage] = useState("");
  const totalRows = totalPages * pageSize;

  const handleJump = () => {
    let page = Number(jumpPage);
    if (!page || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    setJumpPage("");
  };

  const allowedSizes = [5, 10, 15, 20, 30, 50, 100].filter((size) => size <= totalRows);

  // Always include max if all sizes > totalRows
  if (allowedSizes.length === 0) {
    allowedSizes.push(totalRows);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page:</span>
        {/* <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="cursor-pointer rounded border px-2 py-1 text-sm"
        >
          {[5, 10, 15, 20, 30, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select> */}
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="cursor-pointer rounded border px-2 py-1 text-sm"
        >
          {allowedSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-12">
        {/* Page numbers */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-18 cursor-pointer rounded-lg border bg-[#714b67] px-2 py-1 text-white disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages })
            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
            .map((_, idx) => {
              const page = idx + Math.max(1, currentPage - 2);
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`cursor-pointer rounded px-3 py-1 text-sm ${
                    page === currentPage ? "bg-[#714b67] text-white" : "border"
                  }`}
                >
                  {page}
                </button>
              );
            })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-18 cursor-pointer rounded-lg border bg-[#714b67] px-2 py-1 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Jump to page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Go to:</span>
          <input
            type="number"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="w-16 rounded border px-2 py-1 text-sm"
          />
          <button
            onClick={handleJump}
            className="cursor-pointer rounded bg-[#714b67] px-3 py-1 text-sm text-white"
          >
            Go
          </button>
        </div>
      </div>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
