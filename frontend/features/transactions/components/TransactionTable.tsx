import React from "react";
import { Eye } from "lucide-react";
import type { Transaction } from "../types";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionTypeBadge } from "./TransactionTypeBadge";

interface TransactionTableProps {
  transactions: Transaction[];
  onView: (id: number) => void;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function TransactionTable({ transactions, onView }: TransactionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border/80 bg-[#0f172a] text-xs uppercase tracking-wider text-[#94a3b8]">
            <tr>
              <th className="px-5 py-4 font-semibold text-foreground">Transaction ID</th>
              <th className="px-5 py-4 font-semibold text-foreground">Product</th>
              <th className="px-5 py-4 font-semibold text-foreground">SKU</th>
              <th className="px-5 py-4 font-semibold text-foreground">Warehouse</th>
              <th className="px-5 py-4 font-semibold text-foreground">Type</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Quantity</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Previous Stock</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Current Stock</th>
              <th className="px-5 py-4 font-semibold text-foreground">Operator</th>
              <th className="px-5 py-4 font-semibold text-foreground">Date</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`transition hover:bg-muted/40 ${
                  index % 2 === 0 ? "bg-card/45" : "bg-card"
                }`}
              >
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">
                  #{transaction.id}
                </td>
                <td className="max-w-[220px] truncate px-5 py-3.5 font-semibold text-white">
                  {transaction.product_name}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs uppercase tracking-wider text-primary">
                  {transaction.sku}
                </td>
                <td className="px-5 py-3.5 font-medium text-[#e2e8f0]">{transaction.warehouse}</td>
                <td className="px-5 py-3.5">
                  <TransactionTypeBadge type={transaction.transaction_type} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <TransactionStatus quantity={transaction.quantity} />
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#94a3b8]">
                  {transaction.previous_stock.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-white">
                  {transaction.new_stock.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 font-medium text-[#e2e8f0]">{transaction.operator}</td>
                <td className="px-5 py-3.5 text-xs font-medium text-[#64748b]">
                  {formatDate(transaction.created_at)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onView(transaction.id)}
                    title="View transaction"
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted hover:text-white"
                  >
                    <Eye className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
