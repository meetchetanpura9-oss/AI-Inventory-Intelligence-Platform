import React, { useState } from "react";
import { X, ClipboardEdit, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/services/product";
import { useRemoveStock } from "../hooks/useRemoveStock";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import type { Inventory } from "../types";

interface RemoveStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductId?: number | null;
}

export function RemoveStockDialog({ isOpen, onClose, defaultProductId }: RemoveStockDialogProps) {
  const queryClient = useQueryClient();
  const removeStockMutation = useRemoveStock();

  // Fetch product catalog for dropdown list
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    enabled: isOpen,
  });

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDefaultProductId, setPrevDefaultProductId] = useState(defaultProductId);
  
  if (isOpen !== prevIsOpen || defaultProductId !== prevDefaultProductId) {
    setPrevIsOpen(isOpen);
    setPrevDefaultProductId(defaultProductId);
    if (isOpen) {
      setProductId(defaultProductId ? String(defaultProductId) : (products[0] ? String(products[0].id) : ""));
      setQuantity(0);
      setReason("");
      setRemarks("");
    }
  }

  const [prevProductsLength, setPrevProductsLength] = useState(products.length);
  if (products.length !== prevProductsLength) {
    setPrevProductsLength(products.length);
    if (isOpen && !productId && products.length > 0) {
      setProductId(String(products[0].id));
    }
  }

  // Derive availableStock directly in render
  const inventoryList = queryClient.getQueryData<Inventory[]>(["inventory"]) || [];
  const stockItem = productId ? inventoryList.find((inv) => inv.product_id === Number(productId)) : undefined;
  const availableStock = stockItem ? stockItem.current_stock : (productId ? 0 : null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Please select a product.");
      return;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }
    if (availableStock !== null && quantity > availableStock) {
      toast.error(`Cannot deduct more than available stock (${availableStock} units).`);
      return;
    }

    removeStockMutation.mutate(
      {
        productId: Number(productId),
        payload: {
          quantity,
          reference: reason.trim() || undefined,
          remarks: remarks.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Stock Removed Successfully");
          onClose();
        },
        onError: (err) => {
          toast.error(getFriendlyErrorMessage(err));
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
          disabled={removeStockMutation.isPending}
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2">
          <ClipboardEdit className="size-5.5 text-[#ef4444]" />
          Deduct Inventory Stock
        </h3>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Select Product */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Select Product *</label>
            {isLoadingProducts ? (
              <div className="h-10 w-full rounded-lg border border-border bg-background px-3 flex items-center text-xs text-[#94a3b8]">
                <RefreshCw className="size-4 animate-spin mr-2" />
                Loading product catalog...
              </div>
            ) : (
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                disabled={removeStockMutation.isPending || !!defaultProductId}
              >
                {products.length === 0 && <option value="">No products available</option>}
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.product_name} ({prod.sku})
                  </option>
                ))}
              </select>
            )}
            {availableStock !== null && (
              <p className="text-[11px] font-semibold text-[#94a3b8] mt-1">
                Available Stock: <span className="text-white font-bold">{availableStock}</span> units
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Quantity (Units) *</label>
            <input
              type="number"
              required
              min="1"
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="e.g. 10"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={removeStockMutation.isPending}
            />
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Reason / Reference *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Sale, Damaged Stock, Transfer"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={removeStockMutation.isPending}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Remarks / Internal Notes</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write details of why stock is being removed..."
              className="h-20 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={removeStockMutation.isPending}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-border hover:bg-muted text-xs"
              disabled={removeStockMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={removeStockMutation.isPending || isLoadingProducts || !productId}
              className="gap-1.5 text-xs font-semibold bg-[#ef4444] hover:bg-[#ef4444]/90"
            >
              {removeStockMutation.isPending ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Deducting...
                </>
              ) : (
                "Remove Stock"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RemoveStockDialog;
