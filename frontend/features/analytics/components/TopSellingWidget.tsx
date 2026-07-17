import React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../services/analyticsService";
import type { TopProduct } from "../types";

export function TopSellingWidget({ products }: { products: TopProduct[] }) {
  const TrendIcon = ({ trend }: { trend: TopProduct["trend"] }) => {
    if (trend === "Up") return <ArrowUpRight className="size-4 text-emerald-300" />;
    if (trend === "Down") return <ArrowDownRight className="size-4 text-rose-300" />;
    return <ArrowRight className="size-4 text-amber-300" />;
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Top Selling Products</h2>
      <div className="mt-4 space-y-3">
        {products.slice(0, 6).map((product) => (
          <div key={product.product_id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl bg-black/20 p-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{product.product_name}</p>
              <p className="text-xs text-[#64748b]">{product.sales.toLocaleString()} sales</p>
            </div>
            <span className="font-bold text-[#e2e8f0]">{formatCurrency(product.revenue)}</span>
            <TrendIcon trend={product.trend} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopSellingWidget;
