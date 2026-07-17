import React from "react";
import { ArrowDownRight, Megaphone } from "lucide-react";
import type { DemandProduct } from "../types";
import { DemandScoreBadge } from "./DemandScoreBadge";

interface LowDemandProductsProps {
  products: DemandProduct[];
  onViewDetails: (product: DemandProduct) => void;
}

export function LowDemandProducts({ products, onViewDetails }: LowDemandProductsProps) {
  // Sort by demand score ascending, get top 5 low demand items
  const lowItems = [...products]
    .sort((a, b) => a.demand_score - b.demand_score)
    .slice(0, 5);

  const getSuggestedAction = (item: DemandProduct) => {
    if (item.current_stock > 40) return "Clearance (-30%)";
    if (item.current_stock > 20) return "Bundle Offer";
    return "Promo (-15%)";
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <Megaphone className="size-4.5 text-[#ef4444]" />
            Low Demand Products
          </h3>
          <p className="text-[11px] text-[#94a3b8]">Items needing promotion or markdowns</p>
        </div>
      </div>

      {lowItems.length === 0 ? (
        <p className="text-xs text-[#64748b] text-center py-6">No low-demand items found</p>
      ) : (
        <div className="divide-y divide-border/40">
          {lowItems.map((item) => (
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
                  Stock: {item.current_stock} • {item.category}
                </span>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[#ef4444] block font-bold bg-[#ef4444]/10 px-1.5 py-0.5 rounded text-center">
                    {getSuggestedAction(item)}
                  </span>
                  <span className="text-[9px] text-[#64748b] block text-right mt-0.5">
                    Score: {item.demand_score}
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

export default LowDemandProducts;
