"use client";

import React from "react";
import { Boxes, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface InventoryCardProps {
  item: InventoryItem;
}

export function InventoryCard({ item }: InventoryCardProps) {
  const isLowStock = item.current_stock <= item.reorder_level;
  const isOutOfStock = item.current_stock === 0;

  return (
    <div className="rounded-2xl border border-[#223046] bg-[#102235] p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#14b8a6]/10 text-[#14b8a6]">
          <Boxes className="size-5" />
        </div>
        <div
          className={`rounded-lg px-2 py-1 text-xs font-semibold ${
            isOutOfStock
              ? "bg-[#ef4444]/10 text-[#ef4444]"
              : isLowStock
              ? "bg-[#f59e0b]/10 text-[#f59e0b]"
              : "bg-[#10b981]/10 text-[#10b981]"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-base font-semibold text-white truncate">{item.product_name}</h4>
        <p className="text-xs text-[#94a3b8]">Warehouse: {item.warehouse_name || "Main Warehouse"}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#223046] pt-4">
        <div>
          <p className="text-xs text-[#94a3b8]">Current Stock</p>
          <p className="text-lg font-bold text-white">{item.current_stock}</p>
        </div>
        <div>
          <p className="text-xs text-[#94a3b8]">Reorder Level</p>
          <p className="text-lg font-bold text-[#94a3b8]">{item.reorder_level}</p>
        </div>
      </div>

      {isLowStock && (
        <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#f59e0b]/10 p-2.5 text-xs text-[#f59e0b]">
          <AlertTriangle className="size-4 shrink-0" />
          <span>Stock level is at or below reorder threshold.</span>
        </div>
      )}
    </div>
  );
}
export default InventoryCard;
