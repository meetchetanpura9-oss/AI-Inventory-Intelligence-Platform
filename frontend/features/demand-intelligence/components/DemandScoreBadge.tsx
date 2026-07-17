import React from "react";
import { cn } from "@/lib/utils";

interface DemandScoreBadgeProps {
  score: number;
}

export function DemandScoreBadge({ score }: DemandScoreBadgeProps) {
  let textColor = "text-[#ef4444]";
  let progressColor = "bg-[#ef4444]";
  let bgColor = "bg-[#ef4444]/10";

  if (score >= 120) {
    textColor = "text-[#22c55e]";
    progressColor = "bg-[#22c55e]";
    bgColor = "bg-[#22c55e]/10";
  } else if (score >= 50) {
    textColor = "text-[#eab308]";
    progressColor = "bg-[#eab308]";
    bgColor = "bg-[#eab308]/10";
  }

  // Bound visual bar percentage to 100% max
  const visualPercentage = Math.min(100, Math.max(0, (score / 150) * 100));

  return (
    <div className="flex flex-col gap-1.5 min-w-[70px]">
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", textColor, bgColor)}>
          {score.toFixed(0)}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", progressColor)} 
          style={{ width: `${visualPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default DemandScoreBadge;
