"use client";

import React from "react";
import { Package, Edit2, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[#223046] bg-[#102235] p-5 transition-all duration-200 hover:border-blue-500/50">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#3b82f6]">
          <Package className="size-5" />
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="flex size-7.5 items-center justify-center rounded-lg hover:bg-[#223046] text-[#94a3b8] hover:text-white"
              aria-label="Edit Product"
            >
              <Edit2 className="size-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="flex size-7.5 items-center justify-center rounded-lg hover:bg-red-500/10 text-[#ef4444]"
              aria-label="Delete Product"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#14b8a6]">
          {product.category || "General"}
        </span>
        <h4 className="mt-1 text-base font-semibold text-white truncate">{product.product_name}</h4>
        <p className="text-xs text-[#94a3b8]">SKU: {product.sku}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#223046] pt-4">
        <div>
          <p className="text-xs text-[#94a3b8]">MRP / Selling</p>
          <p className="text-sm font-semibold text-white">
            ${product.selling_price.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#94a3b8]">Brand</p>
          <p className="text-sm font-medium text-white truncate max-w-[100px]">
            {product.brand || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
