import React from "react";
import { ArrowDownCircle, ArrowUpCircle, CalendarClock, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionSummary } from "../types";
import { TransactionCard } from "./TransactionCard";

interface SummaryCardsProps {
  summary?: TransactionSummary;
  isLoading?: boolean;
}

export function SummaryCards({ summary, isLoading = false }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border border-border bg-card/45 p-5">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="mt-4 h-8 w-20 bg-white/10" />
            <Skeleton className="mt-3 h-3 w-36 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  const data = summary ?? {
    todays_transactions: 0,
    stock_added: 0,
    stock_removed: 0,
    manual_adjustments: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TransactionCard
        title="Today's Transactions"
        value={data.todays_transactions.toLocaleString()}
        detail="Inventory movements logged today"
        icon={CalendarClock}
      />
      <TransactionCard
        title="Stock Added"
        value={`${data.stock_added.toLocaleString()} Units`}
        detail="Positive inventory movement"
        icon={ArrowUpCircle}
        tone="green"
      />
      <TransactionCard
        title="Stock Removed"
        value={`${data.stock_removed.toLocaleString()} Units`}
        detail="Sale and outbound movement"
        icon={ArrowDownCircle}
        tone="red"
      />
      <TransactionCard
        title="Manual Adjustments"
        value={data.manual_adjustments.toLocaleString()}
        detail="Manual updates and adjustments"
        icon={SlidersHorizontal}
        tone="amber"
      />
    </div>
  );
}

export default SummaryCards;
