"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
        <span>Rows per page:</span>
        {onPageSizeChange ? (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-[#223046] bg-[#102235] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#3b82f6]"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-semibold text-white">{pageSize}</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex size-9 items-center justify-center rounded-lg border border-[#223046] bg-[#102235] text-[#94a3b8] transition-colors hover:text-white disabled:opacity-50 disabled:hover:bg-[#102235] disabled:hover:text-[#94a3b8]"
          aria-label="Previous Page"
        >
          <ChevronLeft className="size-4.5" />
        </button>

        <span className="text-sm font-medium text-white px-4">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex size-9 items-center justify-center rounded-lg border border-[#223046] bg-[#102235] text-[#94a3b8] transition-colors hover:text-white disabled:opacity-50 disabled:hover:bg-[#102235] disabled:hover:text-[#94a3b8]"
          aria-label="Next Page"
        >
          <ChevronRight className="size-4.5" />
        </button>
      </div>
    </div>
  );
}
export default Pagination;
