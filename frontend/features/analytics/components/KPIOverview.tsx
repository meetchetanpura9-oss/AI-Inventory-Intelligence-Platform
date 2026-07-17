import React from "react";
import { AlertCircle, BrainCircuit, Boxes, IndianRupee, PackageX, ReceiptText, ShoppingCart, Warehouse } from "lucide-react";
import { formatCurrency } from "../services/analyticsService";
import type { AnalyticsSummary } from "../types";

interface KPIOverviewProps {
  summary: AnalyticsSummary;
}

export function KPIOverview({ summary }: KPIOverviewProps) {
  const cards = [
    { label: "Total Revenue", value: formatCurrency(summary.total_revenue), icon: IndianRupee, tone: "text-emerald-300 bg-emerald-500/10" },
    { label: "Today's Sales", value: formatCurrency(summary.todays_sales), icon: ShoppingCart, tone: "text-blue-300 bg-blue-500/10" },
    { label: "Today's Purchases", value: formatCurrency(summary.todays_purchases), icon: ReceiptText, tone: "text-amber-300 bg-amber-500/10" },
    { label: "Inventory Value", value: formatCurrency(summary.inventory_value), icon: Boxes, tone: "text-cyan-300 bg-cyan-500/10" },
    { label: "Low Stock Items", value: summary.low_stock_items.toLocaleString(), icon: AlertCircle, tone: "text-orange-300 bg-orange-500/10" },
    { label: "Out of Stock", value: summary.out_of_stock_items.toLocaleString(), icon: PackageX, tone: "text-rose-300 bg-rose-500/10" },
    { label: "Warehouse Health", value: `${summary.warehouse_health}%`, icon: Warehouse, tone: "text-violet-300 bg-violet-500/10" },
    { label: "AI Confidence", value: `${summary.ai_confidence}%`, icon: BrainCircuit, tone: "text-teal-300 bg-teal-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-2xl border border-[#223046] bg-[#102235] p-5 shadow-md transition-all duration-200 hover:border-blue-500/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#94a3b8]">{card.label}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{card.value}</h3>
              </div>
              <div className={`flex size-10 items-center justify-center rounded-xl ${card.tone}`}>
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KPIOverview;
