import { Badge } from "@/components/ui/badge";
import type { TopProduct } from "../types/dashboard";

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <h2 className="text-base font-semibold text-white">Top Selling Products</h2>
      <div className="mt-4 space-y-3">
        {products.map((product) => (
          <article key={product.product} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white">
                  {product.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{product.product}</p>
                  <p className="text-xs text-slate-400">{product.sold} sold</p>
                </div>
              </div>
              <Badge className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100" variant="outline">
                {product.trend}
              </Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${product.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
