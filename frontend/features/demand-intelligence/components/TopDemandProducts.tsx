import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import type { DemandProduct } from "../types";
import { DemandScoreBadge } from "./DemandScoreBadge";

interface TopDemandProductsProps {
  products: DemandProduct[];
  onViewDetails: (product: DemandProduct) => void;
}

export function TopDemandProducts({ products, onViewDetails }: TopDemandProductsProps) {
  // Sort by demand score descending, get top 5
  const topItems = [...products]
    .sort((a, b) => b.demand_score - a.demand_score)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="size-4.5 text-[#22c55e]" />
            Top Demand Products
          </h3>
          <p className="text-[11px] text-[#94a3b8]">Items with high sales velocity</p>
        </div>
      </div>

      {topItems.length === 0 ? (
        <p className="text-xs text-[#64748b] text-center py-6">No high-demand data</p>
      ) : (
        <div className="divide-y divide-border/40">
          {topItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onViewDetails(item)}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-muted/20 px-1 rounded-lg cursor-pointer transition-colors"
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs font-semibold text-white block truncate">
                  {item.product_name}
                </span>
                <span className="text-[10px] text-[#64748b] block font-mono">
                  {item.sku} • {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[#64748b] block uppercase tracking-wider font-semibold">Trend</span>
                  <span className="text-xs font-bold text-[#22c55e] flex items-center justify-end">
                    <ArrowUpRight className="size-3" />
                    +{(item.demand_score * 0.2 + 5).toFixed(0)}%
                  </span>
                </div>
                <div className="w-[70px]">
                  <DemandScoreBadge score={item.demand_score} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopDemandProducts;
