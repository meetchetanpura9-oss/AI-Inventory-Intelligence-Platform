import React from "react";
import { Badge } from "@/components/ui/badge";
import type { PurchasePaymentStatus } from "../types";

const styles: Record<PurchasePaymentStatus, string> = {
  Paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  "Partially Paid": "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

export function PurchasePaymentBadge({ status }: { status: PurchasePaymentStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </Badge>
  );
}

export default PurchasePaymentBadge;
