import React, { useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, LineChart } from "lucide-react";
import type { DemandProduct } from "../types";
import { DemandScoreBadge } from "./DemandScoreBadge";
import { DemandLevelBadge } from "./DemandLevelBadge";
import { RecommendationBadge } from "./RecommendationCard";

interface DemandTableProps {
  products: DemandProduct[];
  onViewDetails: (product: DemandProduct) => void;
}

type SortField = "product_name" | "sku" | "category" | "current_stock" | "sales_count" | "search_count" | "failed_searches" | "demand_score" | "last_updated";
type SortOrder = "asc" | "desc";

export function DemandTable({ products, onViewDetails }: DemandTableProps) {
  const [sortField, setSortField] = useState<SortField>("demand_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "last_updated") {
      aVal = new Date(a.last_updated).getTime();
      bVal = new Date(b.last_updated).getTime();
    }

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isSorted = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)} 
        className="px-5 py-4 font-semibold text-foreground cursor-pointer hover:bg-muted/30 select-none transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {isSorted ? (
            sortOrder === "asc" ? <ChevronUp className="size-3.5 text-primary" /> : <ChevronDown className="size-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="size-3 text-[#64748b]" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-xs tracking-wider border-b border-border/80">
              <tr>
                <SortHeader field="product_name" label="Product" />
                <SortHeader field="sku" label="SKU" />
                <SortHeader field="category" label="Category" />
                <SortHeader field="current_stock" label="Current Stock" />
                <SortHeader field="sales_count" label="Sales" />
                <SortHeader field="search_count" label="Searches" />
                <SortHeader field="failed_searches" label="Failed Searches" />
                <SortHeader field="demand_score" label="Demand Score" />
                <th className="px-5 py-4 font-semibold text-foreground">Demand Level</th>
                <th className="px-5 py-4 font-semibold text-foreground">Recommendation</th>
                <SortHeader field="last_updated" label="Last Updated" />
                <th className="px-5 py-4 font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedProducts.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition hover:bg-muted/40 ${
                    idx % 2 === 0 ? "bg-card/45" : "bg-card"
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-white max-w-[180px] truncate">
                    {item.product_name}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-primary uppercase tracking-wider">
                    {item.sku}
                  </td>
                  <td className="px-5 py-3.5 text-[#e2e8f0] font-medium">
                    {item.category}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white">
                    {item.current_stock}
                  </td>
                  <td className="px-5 py-3.5 text-white">
                    {item.sales_count}
                  </td>
                  <td className="px-5 py-3.5 text-[#94a3b8]">
                    {item.search_count}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={item.failed_searches > 0 ? "text-[#ef4444] font-medium" : "text-[#64748b]"}>
                      {item.failed_searches}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <DemandScoreBadge score={item.demand_score} />
                  </td>
                  <td className="px-5 py-3.5">
                    <DemandLevelBadge level={item.demand_level} />
                  </td>
                  <td className="px-5 py-3.5">
                    <RecommendationBadge type={item.recommendation} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#64748b] font-medium">
                    {formatDate(item.last_updated)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onViewDetails(item)}
                      title="View Projections"
                      className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted hover:text-white text-xs font-semibold"
                    >
                      <LineChart className="size-3.5 text-primary" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden select-none">
        {paginatedProducts.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4.5 shadow-lg hover:border-primary/40 transition"
          >
            <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2.5">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white leading-snug truncate">
                  {item.product_name}
                </h4>
                <span className="text-[10px] font-semibold text-primary tracking-wider uppercase block mt-0.5">
                  SKU: {item.sku}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <DemandLevelBadge level={item.demand_level} />
                <RecommendationBadge type={item.recommendation} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs py-1">
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Category
                </span>
                <span className="text-[#e2e8f0] font-semibold">{item.category}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Stock / Sales
                </span>
                <span className="text-white font-bold">{item.current_stock} / {item.sales_count}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Searches (Failed)
                </span>
                <span className="text-[#e2e8f0] font-medium">{item.search_count} ({item.failed_searches})</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Updated
                </span>
                <span className="text-[#64748b] font-medium">{formatDate(item.last_updated)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="w-[100px]">
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider mb-1">
                  Demand Score
                </span>
                <DemandScoreBadge score={item.demand_score} />
              </div>
              <button
                onClick={() => onViewDetails(item)}
                className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition"
              >
                <LineChart className="size-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4 select-none">
          <p className="text-xs text-[#94a3b8]">
            Showing page <span className="font-semibold text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemandTable;
