"use client";

import React, { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  changeType?: "increase" | "decrease";
  timeframe?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  change,
  changeType = "increase",
  timeframe = "vs last month",
}: MetricCardProps) {
  const isPositive = changeType === "increase";

  return (
    <div className="rounded-2xl border border-[#223046] bg-[#102235] p-6 shadow-md transition-all duration-200 hover:border-blue-500/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#94a3b8]">{title}</span>
        {icon && <div className="text-[#3b82f6]">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-semibold text-white">{value}</h3>
        {change !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          >
            {isPositive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            <span>{change}%</span>
          </div>
        )}
      </div>
      {change !== undefined && (
        <p className="mt-1 text-xs text-[#94a3b8]">{timeframe}</p>
      )}
    </div>
  );
}
export default MetricCard;
