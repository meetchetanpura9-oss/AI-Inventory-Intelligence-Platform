import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export function ProductPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ProductPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pageWindow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
  const endPage = Math.min(totalPages, startPage + pageWindow - 1);
  const adjustedStartPage = Math.max(1, endPage - pageWindow + 1);
  const pages = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/25 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs font-medium text-[#94a3b8]">
        Showing <span className="font-semibold text-foreground">{startItem}</span>-
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> products
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
          <span>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(event) => {
              onItemsPerPageChange(Number(event.target.value));
              onPageChange(1);
            }}
            className="h-8 rounded border border-border bg-card px-2 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="size-8 border-border hover:bg-muted"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {adjustedStartPage > 1 && (
            <span className="px-2 text-xs text-[#94a3b8]">...</span>
          )}

          {pages.map((page) => {
            const isCurrent = page === currentPage;
            return (
              <Button
                key={page}
                variant={isCurrent ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className={`size-8 text-xs ${isCurrent ? "" : "border-border hover:bg-muted"}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}

          {endPage < totalPages && (
            <span className="px-2 text-xs text-[#94a3b8]">...</span>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="size-8 border-border hover:bg-muted"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductPagination;
