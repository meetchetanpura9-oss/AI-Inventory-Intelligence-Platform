import React from "react";
import { PlusCircle, MinusCircle, History } from "lucide-react";
import type { Inventory } from "../types";
import { StockStatusBadge } from "./StockStatusBadge";
import { StockProgress } from "./StockProgress";

interface InventoryTableProps {
  items: Inventory[];
  onAddStock: (productId: number, productName: string) => void;
  onRemoveStock: (productId: number, productName: string) => void;
  onViewHistory: (productId: number, productName: string) => void;
  canOperate?: boolean;
}

export function InventoryTable({
  items,
  onAddStock,
  onRemoveStock,
  onViewHistory,
  canOperate = false,
}: InventoryTableProps) {
  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) : "-";
  };

  return (
    <div className="w-full">
      {/* 1. Desktop & Tablet view: Table format */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-xs tracking-wider border-b border-border/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-foreground">Product</th>
                <th className="px-5 py-4 font-semibold text-foreground">SKU</th>
                <th className="px-5 py-4 font-semibold text-foreground">Warehouse</th>
                <th className="px-5 py-4 font-semibold text-foreground text-center">Stock</th>
                <th className="px-5 py-4 font-semibold text-foreground text-center">Min / Max</th>
                <th className="px-5 py-4 font-semibold text-foreground min-w-[140px]">Progress</th>
                <th className="px-5 py-4 font-semibold text-foreground">Status</th>
                <th className="px-5 py-4 font-semibold text-foreground">Last Updated</th>
                <th className="px-5 py-4 font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition hover:bg-muted/40 ${
                    idx % 2 === 0 ? "bg-card/45" : "bg-card"
                  }`}
                >
                  {/* Name */}
                  <td className="px-5 py-3.5 font-semibold text-white max-w-[180px] truncate">
                    {item.product_name}
                  </td>

                  {/* SKU */}
                  <td className="px-5 py-3.5 font-mono text-xs text-primary uppercase tracking-wider">
                    {item.sku}
                  </td>

                  {/* Warehouse */}
                  <td className="px-5 py-3.5 text-[#e2e8f0] font-medium">
                    {item.warehouse}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-3.5 font-bold text-white text-center">
                    {item.current_stock} <span className="text-[11px] font-normal text-[#94a3b8]">{item.unit}</span>
                  </td>

                  {/* Min / Max limits */}
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8] text-center font-medium">
                    {item.minimum_stock} / {item.maximum_stock}
                  </td>

                  {/* Progress bar */}
                  <td className="px-5 py-3.5">
                    <StockProgress current={item.current_stock} maximum={item.maximum_stock} />
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-3.5">
                    <StockStatusBadge status={item.status} />
                  </td>

                  {/* Last updated date */}
                  <td className="px-5 py-3.5 text-xs text-[#64748b] font-medium">
                    {formatDate(item.updated_at)}
                  </td>

                  {/* Action buttons */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canOperate && (
                        <>
                          <button
                            onClick={() => onAddStock(item.product_id, item.product_name)}
                            title="Add Stock"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-emerald-400 transition hover:bg-emerald-500/10 hover:text-white"
                          >
                            <PlusCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => onRemoveStock(item.product_id, item.product_name)}
                            title="Remove Stock"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-rose-400 transition hover:bg-rose-500/10 hover:text-white"
                          >
                            <MinusCircle className="size-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onViewHistory(item.product_id, item.product_name)}
                        title="View Stock Movements"
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted hover:text-white"
                      >
                        <History className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile View: Card format list */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden select-none">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4.5 shadow-lg hover:border-primary/40 transition"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2.5">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white leading-snug truncate">
                  {item.product_name}
                </h4>
                <span className="text-[10px] font-semibold text-primary tracking-wider uppercase block mt-0.5">
                  SKU: {item.sku}
                </span>
              </div>
              <StockStatusBadge status={item.status} />
            </div>

            {/* Info details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs py-1">
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Warehouse
                </span>
                <span className="text-[#e2e8f0] font-semibold">{item.warehouse}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Available
                </span>
                <span className="text-white font-bold">{item.current_stock} {item.unit}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Min Limit
                </span>
                <span className="text-[#94a3b8] font-semibold">{item.minimum_stock} units</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">
                  Updated
                </span>
                <span className="text-[#64748b] font-semibold">{formatDate(item.updated_at)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="pt-1.5 border-t border-border/40">
              <StockProgress current={item.current_stock} maximum={item.maximum_stock} />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => onViewHistory(item.product_id, item.product_name)}
                className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border text-xs text-[#94a3b8] hover:bg-muted hover:text-white font-semibold transition mr-auto"
              >
                <History className="size-3.5" />
                History
              </button>
              {canOperate && (
                <>
                  <button
                    onClick={() => onRemoveStock(item.product_id, item.product_name)}
                    className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border text-xs text-rose-400 hover:bg-rose-500/10 hover:text-white font-semibold transition"
                  >
                    <MinusCircle className="size-3.5" />
                    Deduct
                  </button>
                  <button
                    onClick={() => onAddStock(item.product_id, item.product_name)}
                    className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg transition"
                  >
                    <PlusCircle className="size-3.5" />
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryTable;
