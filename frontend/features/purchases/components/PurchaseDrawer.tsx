import React from "react";
import { AlertTriangle, Calendar, Package, ReceiptText, RefreshCw, User, Warehouse, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePurchase } from "../hooks/usePurchase";
import { formatCurrency } from "../services/purchaseService";
import { SupplierBadge } from "./SupplierBadge";
import { PurchasePaymentBadge } from "./PurchasePaymentBadge";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";

interface PurchaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId?: number | null;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-border/40 bg-black/20 p-3">
    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">{label}</span>
    <div className="mt-1 text-sm font-semibold text-[#e2e8f0]">{value}</div>
  </div>
);

export function PurchaseDrawer({ isOpen, onClose, purchaseId }: PurchaseDrawerProps) {
  const { data, isLoading, isError, refetch } = usePurchase(purchaseId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-border bg-[#0f172a] p-5 shadow-2xl sm:p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-border/55 pb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white">Purchase Details</h3>
                <p className="mt-1 truncate text-xs text-[#94a3b8]">{purchaseId ? `Purchase order #${purchaseId}` : "Purchase order"}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 text-[#94a3b8] transition hover:bg-white/10 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-[#94a3b8]">
                  <RefreshCw className="size-8 animate-spin text-primary" />
                  <span className="text-sm font-semibold">Loading purchase details...</span>
                </div>
              ) : isError || !data ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                  <AlertTriangle className="size-10 text-rose-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Unable to load purchase.</h4>
                    <p className="mt-1 text-xs text-[#94a3b8]">Retry the PO lookup.</p>
                  </div>
                  <Button onClick={() => refetch()} size="sm" className="gap-2">
                    <RefreshCw className="size-4" />
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border/50 bg-card/30 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-bold text-white">{data.po_number}</h4>
                        <div className="mt-3">
                          <SupplierBadge supplier={data.supplier} contact={data.supplier_contact} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <PurchasePaymentBadge status={data.payment_status} />
                        <PurchaseStatusBadge status={data.purchase_status} />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">Subtotal</p>
                        <p className="mt-1 text-lg font-bold text-[#e2e8f0]">{formatCurrency(data.subtotal)}</p>
                      </div>
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">Shipping</p>
                        <p className="mt-1 text-lg font-bold text-[#e2e8f0]">{formatCurrency(data.shipping_cost)}</p>
                      </div>
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">Grand Total</p>
                        <p className="mt-1 text-lg font-bold text-white">{formatCurrency(data.grand_total)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailRow label="Purchase Order Number" value={<span className="inline-flex items-center gap-2"><ReceiptText className="size-4 text-primary" />{data.po_number}</span>} />
                    <DetailRow label="Supplier" value={data.supplier} />
                    <DetailRow label="Supplier Contact" value={data.supplier_contact} />
                    <DetailRow label="Warehouse" value={<span className="inline-flex items-center gap-2"><Warehouse className="size-4 text-primary" />{data.warehouse}</span>} />
                    <DetailRow label="Product" value={<span className="inline-flex items-center gap-2"><Package className="size-4 text-primary" />{data.product}</span>} />
                    <DetailRow label="Quantity" value={data.quantity.toLocaleString()} />
                    <DetailRow label="Unit Cost" value={formatCurrency(data.unit_cost)} />
                    <DetailRow label="Discount" value={formatCurrency(data.discount)} />
                    <DetailRow label="Tax" value={formatCurrency(data.tax)} />
                    <DetailRow label="Shipping" value={formatCurrency(data.shipping_cost)} />
                    <DetailRow label="Grand Total" value={formatCurrency(data.grand_total)} />
                    <DetailRow label="Operator" value={<span className="inline-flex items-center gap-2"><User className="size-4 text-primary" />{data.operator}</span>} />
                    <DetailRow label="Payment Status" value={<PurchasePaymentBadge status={data.payment_status} />} />
                    <DetailRow label="Purchase Status" value={<PurchaseStatusBadge status={data.purchase_status} />} />
                    <DetailRow label="Received Date" value={data.received_date ? new Date(data.received_date).toLocaleString() : "-"} />
                    <DetailRow label="Created Date" value={<span className="inline-flex items-center gap-2"><Calendar className="size-4 text-primary" />{new Date(data.created_at).toLocaleString()}</span>} />
                  </div>

                  <div className="rounded-xl border border-border/40 bg-black/20 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Remarks</span>
                    <p className="mt-2 text-sm leading-relaxed text-[#e2e8f0]">{data.remarks}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default PurchaseDrawer;
