import React from "react";
import { AlertCircle, CalendarRange } from "lucide-react";
import type { DemandPrediction } from "../types";

interface PredictionWidgetProps {
  predictions: DemandPrediction[];
}

export function PredictionWidget({ predictions }: PredictionWidgetProps) {
  // Sort critical stockouts first
  const criticalPredictions = [...predictions]
    .sort((a, b) => {
      const getDays = (str: string) => {
        if (str.toLowerCase().includes("stockout")) return 0;
        const match = str.match(/(\d+)\s*days/i);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getDays(a.estimated_stockout_date) - getDays(b.estimated_stockout_date);
    })
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <CalendarRange className="size-4.5 text-primary" />
            Stockout Predictions (Critical)
          </h3>
          <p className="text-[11px] text-[#94a3b8]">Estimated depletion timelines</p>
        </div>
      </div>

      {criticalPredictions.length === 0 ? (
        <p className="text-xs text-[#64748b] text-center py-6">All items are stable</p>
      ) : (
        <div className="divide-y divide-border/40">
          {criticalPredictions.map((pred) => {
            const isStockout = pred.estimated_stockout_date.toLowerCase().includes("stockout");
            const isNearRisk = pred.estimated_stockout_date.toLowerCase().includes("days") && 
              parseInt(pred.estimated_stockout_date.match(/\d+/)?.join("") || "10", 10) <= 7;

            return (
              <div 
                key={pred.product_id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-muted/10 px-1 rounded-lg transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-white block truncate">
                    {pred.product_name}
                  </span>
                  <span className="text-[10px] text-[#64748b] block font-mono">
                    Stock: {pred.current_stock} units • Proj. Demand: {pred.predicted_demand}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  {isStockout ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded">
                      <AlertCircle className="size-3" />
                      Stockout
                    </span>
                  ) : isNearRisk ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded">
                      {pred.estimated_stockout_date}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">
                      {pred.estimated_stockout_date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PredictionWidget;
