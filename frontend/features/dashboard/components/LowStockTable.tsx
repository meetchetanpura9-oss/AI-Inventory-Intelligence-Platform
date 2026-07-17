import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyDashboardState } from "./DashboardStates";
import type { LowStockProduct } from "../types/dashboard";

const statusClasses: Record<LowStockProduct["status"], string> = {
  Critical: "border-red-300/20 bg-red-500/10 text-red-100",
  Warning: "border-amber-300/20 bg-amber-500/10 text-amber-100",
  Safe: "border-emerald-300/20 bg-emerald-500/10 text-emerald-100",
};

interface LowStockTableProps {
  products: LowStockProduct[];
}

export function LowStockTable({ products }: LowStockTableProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <h2 className="text-base font-semibold text-white">Low Stock Products</h2>
      {products.length === 0 ? (
        <div className="mt-4">
          <EmptyDashboardState title="No low-stock products" />
        </div>
      ) : (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-300">Product</TableHead>
                <TableHead className="text-slate-300">Stock</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-right text-slate-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product} className="border-white/10 hover:bg-white/[0.04]">
                  <TableCell className="font-medium text-white">{product.product}</TableCell>
                  <TableCell className="text-slate-300">{product.stock}</TableCell>
                  <TableCell>
                    <Badge className={cn("border", statusClasses[product.status])} variant="outline">
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant={product.action === "Reorder" ? "default" : "outline"}>
                      {product.action}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
