import React from "react";
import { cn } from "@/lib/utils";

interface StockProgressProps {
  current: number;
  maximum: number;
  className?: string;
}

export function StockProgress({ current, maximum, className }: StockProgressProps) {
  const maxVal = maximum > 0 ? maximum : 100;
  const percentage = Math.min(100, Math.max(0, Math.round((current / maxVal) * 100)));

  // Color thresholds
  let barColor = "bg-emerald-500 shadow-emerald-500/25";
  let textColor = "text-emerald-400";
  if (percentage < 15) {
    barColor = "bg-rose-500 shadow-rose-500/25";
    textColor = "text-rose-400";
  } else if (percentage < 50) {
    barColor = "bg-amber-500 shadow-amber-500/25";
    textColor = "text-amber-400";
  }

  return (
    <div className={cn("space-y-1.5 min-w-[120px] select-none", className)}>
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="text-[#94a3b8]">
          {current} / <span className="opacity-80">{maximum} max</span>
        </span>
        <span className={cn("font-bold", textColor)}>{percentage}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border/40">
        <div
          className={cn("h-full rounded-full transition-all duration-500 shadow-sm", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default StockProgress;
