import React from "react";
import { TrendingUp, TrendingDown, BrainCircuit, ShoppingCart, AlertTriangle, ShieldCheck } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";
import type { DemandSummary } from "../types";

interface DemandSummaryCardsProps {
  summary: DemandSummary;
}

export function DemandSummaryCards({ summary }: DemandSummaryCardsProps) {
  const cards = [
    {
      title: "High Demand Products",
      value: summary.highDemandProductsCount.toLocaleString(),
      icon: <TrendingUp className="size-5 text-[#22c55e]" />,
      change: 14,
      changeType: "increase" as const,
      timeframe: "Strong customer intent",
    },
    {
      title: "Low Demand Products",
      value: summary.lowDemandProductsCount.toLocaleString(),
      icon: <TrendingDown className="size-5 text-[#ef4444]" />,
      change: 5,
      changeType: "decrease" as const,
      timeframe: "Overstock risk items",
    },
    {
      title: "Average Demand Score",
      value: `${summary.averageDemandScore}%`,
      icon: <BrainCircuit className="size-5 text-[#3b82f6]" />,
      change: 3,
      changeType: "increase" as const,
      timeframe: "Mean score velocity",
    },
    {
      title: "Reorder Required",
      value: summary.reorderRequiredCount.toLocaleString(),
      icon: <ShoppingCart className="size-5 text-[#f97316]" />,
      change: summary.reorderRequiredCount > 0 ? 8 : undefined,
      changeType: "increase" as const,
      timeframe: "Below safety threshold",
    },
    {
      title: "Predicted Stockouts",
      value: summary.predictedStockoutsCount.toLocaleString(),
      icon: <AlertTriangle className="size-5 text-[#eab308]" />,
      change: summary.predictedStockoutsCount > 0 ? 6 : undefined,
      changeType: "increase" as const,
      timeframe: "Critical risk within 7 days",
    },
    {
      title: "AI Confidence",
      value: `${summary.aiConfidence}%`,
      icon: <ShieldCheck className="size-5 text-[#14b8a6]" />,
      change: 1,
      changeType: "increase" as const,
      timeframe: "Model validation rating",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <MetricCard
          key={c.title}
          title={c.title}
          value={c.value}
          icon={c.icon}
          change={c.change}
          changeType={c.changeType}
          timeframe={c.timeframe}
        />
      ))}
    </div>
  );
}

export default DemandSummaryCards;
