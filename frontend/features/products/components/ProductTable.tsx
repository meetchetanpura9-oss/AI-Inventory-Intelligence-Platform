import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";
import { ProductStatus } from "./ProductStatus";
import type { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function ProductTable({
  products,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: ProductTableProps) {
  const showActions = canEdit || canDelete;
  const formatCurrency = (value: number | null | undefined) =>
    `Rs. ${(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const formatDate = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleDateString() : "-";

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="size-3.5 text-[#64748b] transition group-hover:text-[#94a3b8]" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3.5 text-primary" />
    ) : (
      <ArrowDown className="size-3.5 text-primary" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-xs tracking-wider border-b border-border/80">
            <tr>
              <th className="px-6 py-4.5 font-semibold text-foreground">Name</th>
              <th className="px-6 py-4.5 font-semibold text-foreground">SKU</th>
              <th className="px-6 py-4.5 font-semibold text-foreground">Category</th>
              
              {/* Sortable: Price */}
              <th
                onClick={() => onSort("selling_price")}
                className="px-6 py-4.5 font-semibold text-foreground cursor-pointer group select-none"
              >
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Price</span>
                  {renderSortIcon("selling_price")}
                </div>
              </th>

              {/* Sortable: Stock */}
              <th
                onClick={() => onSort("stock")}
                className="px-6 py-4.5 font-semibold text-foreground cursor-pointer group select-none"
              >
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Stock</span>
                  {renderSortIcon("stock")}
                </div>
              </th>

              <th className="px-6 py-4.5 font-semibold text-foreground">Status</th>
              
              {/* Sortable: Created Date */}
              <th
                onClick={() => onSort("created_at")}
                className="px-6 py-4.5 font-semibold text-foreground cursor-pointer group select-none"
              >
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Created</span>
                  {renderSortIcon("created_at")}
                </div>
              </th>

              {showActions && (
                <th className="px-6 py-4.5 font-semibold text-foreground text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {(products ?? []).map((product, idx) => (
              <tr
                key={product?.id}
                className={`transition hover:bg-muted/40 ${
                  idx % 2 === 0 ? "bg-card/40" : "bg-card"
                }`}
              >
                {/* Product Name */}
                <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                  {product?.product_name || "-"}
                </td>

                {/* SKU */}
                <td className="px-6 py-4 font-mono text-[#94a3b8] text-xs uppercase tracking-wider">
                  {product?.sku || "-"}
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-[#e2e8f0] font-medium">{product?.category || "-"}</td>

                {/* Selling Price */}
                <td className="px-6 py-4 font-bold text-white">
                  {formatCurrency(product?.selling_price)}
                </td>

                {/* Stock levels */}
                <td className="px-6 py-4 text-foreground font-semibold">
                  {product?.stock ?? 0} {product?.unit || "pcs"}
                </td>

                {/* Status Badges */}
                <td className="px-6 py-4">
                  <ProductStatus status={product?.status || "Safe"} stock={product?.stock || 0} />
                </td>

                {/* Date Created */}
                <td className="px-6 py-4 text-xs text-[#64748b]">
                  {formatDate(product?.created_at)}
                </td>

                {showActions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          title="Edit Product"
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted hover:text-white"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(product)}
                          title="Delete Product"
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-[#ef4444]/20 bg-card text-[#ef4444] transition hover:bg-[#ef4444]/10 hover:text-white"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductTable;
