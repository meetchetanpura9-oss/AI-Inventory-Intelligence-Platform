import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function TransactionStatus({ quantity }: { quantity: number }) {
  const isIncrease = quantity >= 0;
  const Icon = isIncrease ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-sm font-bold ${
        isIncrease ? "text-emerald-300" : "text-rose-300"
      }`}
    >
      <Icon className="size-4" />
      {isIncrease ? "+" : ""}
      {quantity.toLocaleString()}
    </span>
  );
}

export default TransactionStatus;
