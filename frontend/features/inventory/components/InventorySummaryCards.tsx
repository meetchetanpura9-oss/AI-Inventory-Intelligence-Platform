import React from "react";
import { Package, Layers, AlertTriangle, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";
import { useInventorySummary } from "../hooks/useInventorySummary";
import { Skeleton } from "@/components/ui/skeleton";

export function InventorySummaryCards() {
  const { data, isLoading, isError } = useInventorySummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 select-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-border bg-card/45 p-5 space-y-3 animate-pulse"
          >
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="h-7 w-20 bg-white/10" />
            <Skeleton className="h-3 w-36 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-28 rounded-2xl border border-border bg-card/45 text-xs text-[#94a3b8]"
          >
            Failed to load stats
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Products",
      value: (data.total_products ?? 0).toLocaleString(),
      detail: "Unique items in catalog",
      icon: Package,
      changeType: "increase" as const,
    },
    {
      label: "Total Stock",
      value: `${(data.total_stock ?? 0).toLocaleString()} Units`,
      detail: "All warehouse items combined",
      icon: Layers,
      changeType: "increase" as const,
    },
    {
      label: "Low Stock",
      value: `${data.low_stock_items ?? 0} Products`,
      detail: "Below safety threshold levels",
      icon: AlertTriangle,
      changeType: "decrease" as const,
    },
    {
      label: "Out of Stock",
      value: `${data.out_of_stock_items ?? 0} Products`,
      detail: "Empty stock requiring orders",
      icon: AlertCircle,
      changeType: "decrease" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 select-none">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <MetricCard
            key={m.label}
            title={m.label}
            value={m.value}
            timeframe={m.detail}
            changeType={m.changeType}
            icon={<Icon className="size-5" />}
          />
        );
      })}
    </div>
  );
}

export default InventorySummaryCards;
