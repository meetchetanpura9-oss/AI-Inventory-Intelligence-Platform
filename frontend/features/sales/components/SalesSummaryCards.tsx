import React from "react";
import { CheckCircle2, IndianRupee, ReceiptText, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SaleSummary } from "../types";
import { formatCurrency } from "../services/salesService";

interface SalesSummaryCardsProps {
  summary?: SaleSummary;
  isLoading?: boolean;
}

const Card = ({
  title,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone?: "blue" | "green" | "amber";
}) => {
  const tones = {
    blue: "bg-blue-500/10 text-blue-300",
    green: "bg-emerald-500/10 text-emerald-300",
    amber: "bg-amber-500/10 text-amber-300",
  };

  return (
    <div className="rounded-2xl border border-[#223046] bg-[#102235] p-5 shadow-md transition-all duration-200 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#94a3b8]">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-[#94a3b8]">{detail}</p>
    </div>
  );
};

export function SalesSummaryCards({ summary, isLoading = false }: SalesSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border border-border bg-card/45 p-5">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="mt-4 h-8 w-24 bg-white/10" />
            <Skeleton className="mt-3 h-3 w-36 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  const data = summary ?? {
    todays_revenue: 0,
    orders_today: 0,
    average_order_value: 0,
    completed_orders: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Today's Revenue" value={formatCurrency(data.todays_revenue)} detail="Revenue booked today" icon={IndianRupee} tone="green" />
      <Card title="Orders Today" value={data.orders_today.toLocaleString()} detail="Sales orders created today" icon={ReceiptText} />
      <Card title="Average Order Value" value={formatCurrency(data.average_order_value)} detail="Mean value across filtered orders" icon={TrendingUp} tone="amber" />
      <Card title="Completed Orders" value={data.completed_orders.toLocaleString()} detail="Orders marked completed" icon={CheckCircle2} tone="green" />
    </div>
  );
}

export default SalesSummaryCards;
