import React from "react";
import { X, ArrowLeftRight, Calendar, Tag, ShieldAlert, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventoryHistory } from "../hooks/useInventoryHistory";
import { Badge } from "@/components/ui/badge";

interface InventoryHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number | null;
  productName?: string;
}

export function InventoryHistoryDrawer({
  isOpen,
  onClose,
  productId = null,
  productName,
}: InventoryHistoryDrawerProps) {
  const { data: history = [], isLoading, isError, refetch } = useInventoryHistory(productId || undefined);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Purchase":
        return "default";
      case "Sale":
        return "destructive";
      case "Adjustment":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-over panel container */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-border bg-[#0f172a] shadow-2xl p-6 select-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/55 pb-4 mb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowLeftRight className="size-5 text-primary" />
                  <span>Stock Movement History</span>
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 truncate">
                  {productName ? `Showing history for ${productName}` : "Global inventory transaction logs"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-48 space-y-3">
                  <RefreshCw className="size-8 animate-spin text-primary" />
                  <p className="text-xs text-[#94a3b8]">Loading transaction history...</p>
                </div>
              ) : isError ? (
                <div className="flex flex-col justify-center items-center h-48 text-center space-y-3 p-6">
                  <ShieldAlert className="size-10 text-rose-500" />
                  <p className="text-sm font-semibold text-white">Failed to load transaction history</p>
                  <button
                    onClick={() => refetch()}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center p-6 space-y-3">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowLeftRight className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Movements Registered</h4>
                  <p className="text-xs text-[#94a3b8] max-w-xs">
                    Inventory transactions will be listed here once you perform stock additions or removals.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {history.map((log) => (
                    <div
                      key={log.id}
                      className="group border border-border/40 bg-card/30 rounded-xl p-4 space-y-2.5 transition-all hover:border-primary/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition truncate">
                            {log.product_name}
                          </h4>
                          <span className="text-[10px] font-semibold text-[#64748b] tracking-wider block mt-0.5">
                            SKU: {log.sku}
                          </span>
                        </div>
                        <Badge variant={getBadgeVariant(log.display_type || "")} className="capitalize py-0.5 px-2">
                          {log.display_type}
                        </Badge>
                      </div>

                      {/* Info Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#94a3b8] pt-1.5 border-t border-border/20">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-[#64748b]" />
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="size-3.5 text-[#64748b]" />
                          <span>Ref: {log.reference || "-"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 rounded-lg p-2.5">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-0.5">
                            Quantity
                          </span>
                          <span className="flex items-center gap-1 font-bold text-white">
                            {log.transaction_type === "IN" ? (
                              <PlusCircle className="size-3.5 text-emerald-400" />
                            ) : (
                              <MinusCircle className="size-3.5 text-rose-400" />
                            )}
                            {log.quantity} pcs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-0.5">
                            Operator
                          </span>
                          <span className="font-semibold text-foreground text-xs">{log.user}</span>
                        </div>
                      </div>

                      {log.remarks && log.remarks !== "-" && (
                        <div className="text-[11px] text-[#94a3b8] leading-relaxed italic bg-muted/10 border-l-2 border-border p-2 rounded-r-lg">
                          &ldquo;{log.remarks}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default InventoryHistoryDrawer;
