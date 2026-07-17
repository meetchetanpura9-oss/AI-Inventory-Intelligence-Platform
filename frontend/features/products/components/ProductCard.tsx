import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductStatus } from "./ProductStatus";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: ProductCardProps) {
  const showActions = canEdit || canDelete;
  const formatCurrency = (value: number | null | undefined) =>
    `Rs. ${(value ?? 0).toLocaleString()}`;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-lg hover:border-primary/40 transition">
      {/* Header containing name and SKU */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-white leading-tight">
            {product?.product_name || "-"}
          </h4>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
            SKU: {product?.sku || "-"}
          </span>
        </div>
        <ProductStatus status={product?.status || "Safe"} stock={product?.stock || 0} />
      </div>

      {/* Info grids */}
      <div className="grid grid-cols-2 gap-2 text-xs border-y border-border/40 py-2.5 my-1">
        <div>
          <span className="text-[#64748b] block text-[10px] uppercase font-semibold">Category</span>
          <span className="text-foreground font-medium">{product?.category || "-"}</span>
        </div>
        <div>
          <span className="text-[#64748b] block text-[10px] uppercase font-semibold">Unit</span>
          <span className="text-foreground font-medium">{product?.unit || "pcs"}</span>
        </div>
        <div>
          <span className="text-[#64748b] block text-[10px] uppercase font-semibold">Selling Price</span>
          <span className="text-white font-bold">{formatCurrency(product?.selling_price)}</span>
        </div>
        <div>
          <span className="text-[#64748b] block text-[10px] uppercase font-semibold">Cost Price</span>
          <span className="text-[#94a3b8]">{formatCurrency(product?.cost_price)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-end gap-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="h-8 border-border text-xs px-2.5 gap-1 hover:bg-muted"
            >
              <Edit2 className="size-3" />
              <span>Edit</span>
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(product)}
              className="h-8 text-xs px-2.5 gap-1 bg-[#ef4444] hover:bg-[#ef4444]/90"
            >
              <Trash2 className="size-3" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
export default ProductCard;
