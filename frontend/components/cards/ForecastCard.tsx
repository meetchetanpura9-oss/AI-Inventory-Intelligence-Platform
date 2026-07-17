"use client";

import React from "react";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import type { ForecastData } from "@/types/analytics";

interface ForecastCardProps {
  forecast: ForecastData;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const isHighRisk = (forecast.stockout_risk ?? 0) > 60;

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-tr from-[#102235] to-[#102235]/40 p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 size-24 bg-blue-500/5 rounded-full blur-2xl" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3b82f6]">
          <Sparkles className="size-4 animate-pulse" />
          <span>AI Forecast</span>
        </div>
        <div
          className={`rounded-lg px-2 py-1 text-xs font-semibold ${
            isHighRisk ? "bg-[#ef4444]/10 text-[#ef4444]" : "bg-[#10b981]/10 text-[#10b981]"
          }`}
        >
          {forecast.stockout_risk}% Stockout Risk
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-base font-semibold text-white truncate">{forecast.product_name}</h4>
        <p className="text-xs text-[#94a3b8]">Period: Next {forecast.forecast_period_days || 30} days</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#223046] pt-4">
        <div>
          <p className="text-xs text-[#94a3b8]">Predicted Demand</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{forecast.predicted_demand}</span>
            <TrendingUp className="size-3.5 text-[#10b981]" />
          </div>
        </div>
        <div>
          <p className="text-xs text-[#94a3b8]">Suggested Reorder</p>
          <span className="text-xl font-bold text-[#14b8a6]">{forecast.suggested_reorder_qty}</span>
        </div>
      </div>

      {isHighRisk && (
        <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#ef4444]/10 p-2.5 text-xs text-[#ef4444]">
          <AlertCircle className="size-4 shrink-0" />
          <span>Order soon to prevent stockout in the next cycle.</span>
        </div>
      )}
    </div>
  );
}
export default ForecastCard;
