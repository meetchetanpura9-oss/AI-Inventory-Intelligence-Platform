import React from "react";
import { Badge } from "@/components/ui/badge";
import type { TransactionType } from "../types";

const styles: Record<TransactionType, string> = {
  Purchase: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Sale: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  "Manual Update": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Transfer: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  "Stock Adjustment": "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap px-2.5 py-1 text-xs font-bold ${styles[type]}`}>
      {type}
    </Badge>
  );
}

export default TransactionTypeBadge;
