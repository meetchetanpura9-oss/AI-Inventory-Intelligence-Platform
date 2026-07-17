import React from "react";
import { Building2, Clock3, IndianRupee, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PurchaseSummary } from "../types";
import { formatCurrency } from "../services/purchaseService";

interface PurchaseSummaryCardsProps {
  summary?: PurchaseSummary;
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

export function PurchaseSummaryCards({ summary, isLoading = false }: PurchaseSummaryCardsProps) {
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
    todays_purchases: 0,
    todays_spend: 0,
    pending_deliveries: 0,
    suppliers: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Today's Purchases" value={`${data.todays_purchases.toLocaleString()} Orders`} detail="Purchase orders created today" icon={Truck} />
      <Card title="Today's Spend" value={formatCurrency(data.todays_spend)} detail="Procurement spend booked today" icon={IndianRupee} tone="green" />
      <Card title="Pending Deliveries" value={`${data.pending_deliveries.toLocaleString()} Orders`} detail="Awaiting receipt or completion" icon={Clock3} tone="amber" />
      <Card title="Suppliers" value={`${data.suppliers.toLocaleString()} Active`} detail="Unique suppliers in filtered view" icon={Building2} />
    </div>
  );
}

export default PurchaseSummaryCards;
