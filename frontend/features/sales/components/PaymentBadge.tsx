import React from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "../types";

const styles: Record<PaymentStatus, string> = {
  Paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Failed: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  Refunded: "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </Badge>
  );
}

export default PaymentBadge;
