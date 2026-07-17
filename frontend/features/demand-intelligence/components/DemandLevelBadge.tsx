import React from "react";
import { Badge } from "@/components/ui/badge";

interface DemandLevelBadgeProps {
  level: "HIGH" | "MEDIUM" | "LOW" | string;
}

export function DemandLevelBadge({ level }: DemandLevelBadgeProps) {
  const normLevel = level.toUpperCase();
  
  if (normLevel === "HIGH") {
    return (
      <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 hover:bg-[#22c55e]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#22c55e]" />
        High
      </Badge>
    );
  }

  if (normLevel === "MEDIUM") {
    return (
      <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20 hover:bg-[#eab308]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#eab308]" />
        Medium
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20 hover:bg-[#ef4444]/15 font-semibold text-xs py-0.5 px-2">
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#ef4444]" />
      Low
    </Badge>
  );
}

export default DemandLevelBadge;
