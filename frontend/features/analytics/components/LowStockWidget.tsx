import React from "react";
import type { LowStockProduct } from "../types";

export function LowStockWidget({ products }: { products: LowStockProduct[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Low Stock</h2>
      <div className="mt-4 space-y-3">
        {products.slice(0, 6).map((product) => (
          <div key={product.product_id} className="rounded-xl bg-black/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-white">{product.product_name}</p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${product.status === "Critical" ? "bg-rose-500/10 text-rose-300" : "bg-amber-500/10 text-amber-300"}`}>
                {product.status}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#94a3b8]">
              <span>Current: {product.current_stock}</span>
              <span>Minimum: {product.minimum_stock}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LowStockWidget;
