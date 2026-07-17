import React from "react";
import { Badge } from "@/components/ui/badge";
import type { PurchaseStatus } from "../types";

const styles: Record<PurchaseStatus, string> = {
  Received: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Ordered: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  Processing: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Pending: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </Badge>
  );
}

export default PurchaseStatusBadge;
