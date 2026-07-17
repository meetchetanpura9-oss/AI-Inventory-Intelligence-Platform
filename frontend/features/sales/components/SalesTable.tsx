import React from "react";
import { Eye } from "lucide-react";
import type { Sale } from "../types";
import { formatCurrency } from "../services/salesService";
import { PaymentBadge } from "./PaymentBadge";
import { SalesStatusBadge } from "./SalesStatusBadge";

interface SalesTableProps {
  sales: Sale[];
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

export function SalesTable({ sales, onView }: SalesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border/80 bg-[#0f172a] text-xs uppercase tracking-wider text-[#94a3b8]">
            <tr>
              <th className="px-5 py-4 font-semibold text-foreground">Invoice</th>
              <th className="px-5 py-4 font-semibold text-foreground">Customer</th>
              <th className="px-5 py-4 font-semibold text-foreground">Product</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Quantity</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Unit Price</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Discount</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Tax</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Total</th>
              <th className="px-5 py-4 font-semibold text-foreground">Payment</th>
              <th className="px-5 py-4 font-semibold text-foreground">Status</th>
              <th className="px-5 py-4 font-semibold text-foreground">Date</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sales.map((sale, index) => (
              <tr
                key={sale.id}
                className={`transition hover:bg-muted/40 ${index % 2 === 0 ? "bg-card/45" : "bg-card"}`}
              >
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{sale.invoice_number}</td>
                <td className="px-5 py-3.5 font-semibold text-white">{sale.customer}</td>
                <td className="max-w-[220px] truncate px-5 py-3.5">
                  <span className="block font-semibold text-[#e2e8f0]">{sale.product}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">{sale.sku}</span>
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-white">{sale.quantity}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#e2e8f0]">{formatCurrency(sale.unit_price)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#94a3b8]">{formatCurrency(sale.discount)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#94a3b8]">{formatCurrency(sale.tax)}</td>
                <td className="px-5 py-3.5 text-right font-bold text-white">{formatCurrency(sale.total)}</td>
                <td className="px-5 py-3.5">
                  <PaymentBadge status={sale.payment_status} />
                </td>
                <td className="px-5 py-3.5">
                  <SalesStatusBadge status={sale.order_status} />
                </td>
                <td className="px-5 py-3.5 text-xs font-medium text-[#64748b]">{formatDate(sale.created_at)}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onView(sale.id)}
                    title="View sale"
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

export default SalesTable;
