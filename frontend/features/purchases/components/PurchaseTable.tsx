import React from "react";
import { Eye } from "lucide-react";
import type { Purchase } from "../types";
import { formatCurrency } from "../services/purchaseService";
import { SupplierBadge } from "./SupplierBadge";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";
import { PurchasePaymentBadge } from "./PurchasePaymentBadge";

interface PurchaseTableProps {
  purchases: Purchase[];
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

export function PurchaseTable({ purchases, onView }: PurchaseTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border/80 bg-[#0f172a] text-xs uppercase tracking-wider text-[#94a3b8]">
            <tr>
              <th className="px-5 py-4 font-semibold text-foreground">PO Number</th>
              <th className="px-5 py-4 font-semibold text-foreground">Supplier</th>
              <th className="px-5 py-4 font-semibold text-foreground">Product</th>
              <th className="px-5 py-4 font-semibold text-foreground">Warehouse</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Quantity</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Unit Cost</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Discount</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Tax</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Grand Total</th>
              <th className="px-5 py-4 font-semibold text-foreground">Payment</th>
              <th className="px-5 py-4 font-semibold text-foreground">Status</th>
              <th className="px-5 py-4 font-semibold text-foreground">Date</th>
              <th className="px-5 py-4 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className={`transition hover:bg-muted/40 ${index % 2 === 0 ? "bg-card/45" : "bg-card"}`}>
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{purchase.po_number}</td>
                <td className="px-5 py-3.5">
                  <SupplierBadge supplier={purchase.supplier} contact={purchase.supplier_contact} />
                </td>
                <td className="max-w-[220px] truncate px-5 py-3.5">
                  <span className="block font-semibold text-[#e2e8f0]">{purchase.product}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">{purchase.sku}</span>
                </td>
                <td className="px-5 py-3.5 font-medium text-[#e2e8f0]">{purchase.warehouse}</td>
                <td className="px-5 py-3.5 text-right font-bold text-white">{purchase.quantity}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#e2e8f0]">{formatCurrency(purchase.unit_cost)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#94a3b8]">{formatCurrency(purchase.discount)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#94a3b8]">{formatCurrency(purchase.tax)}</td>
                <td className="px-5 py-3.5 text-right font-bold text-white">{formatCurrency(purchase.grand_total)}</td>
                <td className="px-5 py-3.5">
                  <PurchasePaymentBadge status={purchase.payment_status} />
                </td>
                <td className="px-5 py-3.5">
                  <PurchaseStatusBadge status={purchase.purchase_status} />
                </td>
                <td className="px-5 py-3.5 text-xs font-medium text-[#64748b]">{formatDate(purchase.created_at)}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onView(purchase.id)}
                    title="View purchase"
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

export default PurchaseTable;
