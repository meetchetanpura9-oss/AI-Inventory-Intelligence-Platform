import React from "react";
import { cn } from "@/lib/utils";

interface StockStatusBadgeProps {
  status: "In Stock" | "Low Stock" | "Out of Stock";
  className?: string;
}

export function StockStatusBadge({ status, className }: StockStatusBadgeProps) {
  const styles = {
    "In Stock": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "Low Stock": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "Out of Stock": "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none transition-colors",
        styles[status] || "text-[#94a3b8] bg-[#64748b]/10 border-[#64748b]/20",
        className
      )}
    >
      <span className={cn(
        "size-1.5 rounded-full animate-pulse",
        status === "In Stock" && "bg-emerald-400",
        status === "Low Stock" && "bg-amber-400",
        status === "Out of Stock" && "bg-rose-400"
      )} />
      {status}
    </span>
  );
}

export default StockStatusBadge;
