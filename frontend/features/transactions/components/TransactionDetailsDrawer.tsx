import React from "react";
import { AlertTriangle, Calendar, Package, RefreshCw, User, Warehouse, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTransaction } from "../hooks/useTransaction";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionTypeBadge } from "./TransactionTypeBadge";

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: number | null;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-border/40 bg-black/20 p-3">
    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">{label}</span>
    <div className="mt-1 text-sm font-semibold text-[#e2e8f0]">{value}</div>
  </div>
);

export function TransactionDetailsDrawer({
  isOpen,
  onClose,
  transactionId,
}: TransactionDetailsDrawerProps) {
  const { data, isLoading, isError, refetch } = useTransaction(transactionId);

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
                <h3 className="text-lg font-bold text-white">Transaction Details</h3>
                <p className="mt-1 truncate text-xs text-[#94a3b8]">
                  {transactionId ? `Audit record #${transactionId}` : "Inventory audit record"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#94a3b8] transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-[#94a3b8]">
                  <RefreshCw className="size-8 animate-spin text-primary" />
                  <span className="text-sm font-semibold">Loading transaction details...</span>
                </div>
              ) : isError || !data ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                  <AlertTriangle className="size-10 text-rose-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Unable to load transaction.</h4>
                    <p className="mt-1 text-xs text-[#94a3b8]">Retry the audit lookup.</p>
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
                        <h4 className="truncate text-base font-bold text-white">{data.product_name}</h4>
                        <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                          SKU: {data.sku}
                        </p>
                      </div>
                      <TransactionTypeBadge type={data.transaction_type} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">Old Stock</p>
                        <p className="mt-1 text-lg font-bold text-[#e2e8f0]">{data.previous_stock}</p>
                      </div>
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">Difference</p>
                        <div className="mt-1 flex justify-center">
                          <TransactionStatus quantity={data.difference} />
                        </div>
                      </div>
                      <div className="rounded-xl bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase text-[#64748b]">New Stock</p>
                        <p className="mt-1 text-lg font-bold text-white">{data.new_stock}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailRow label="Transaction ID" value={`#${data.id}`} />
                    <DetailRow label="Reference" value={data.reference} />
                    <DetailRow label="Warehouse" value={<span className="inline-flex items-center gap-2"><Warehouse className="size-4 text-primary" />{data.warehouse}</span>} />
                    <DetailRow label="Operator" value={<span className="inline-flex items-center gap-2"><User className="size-4 text-primary" />{data.operator}</span>} />
                    <DetailRow label="Product" value={<span className="inline-flex items-center gap-2"><Package className="size-4 text-primary" />{data.product_name}</span>} />
                    <DetailRow label="Date" value={<span className="inline-flex items-center gap-2"><Calendar className="size-4 text-primary" />{new Date(data.created_at).toLocaleString()}</span>} />
                    <DetailRow label="Quantity" value={<TransactionStatus quantity={data.quantity} />} />
                    <DetailRow label="Transaction Type" value={<TransactionTypeBadge type={data.transaction_type} />} />
                  </div>

                  <div className="rounded-xl border border-border/40 bg-black/20 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                      Remarks
                    </span>
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

export default TransactionDetailsDrawer;
