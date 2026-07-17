import React from "react";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "../types";

const styles: Record<OrderStatus, string> = {
  Completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Processing: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Packed: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Shipped: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function SalesStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </Badge>
  );
}

export default SalesStatusBadge;
