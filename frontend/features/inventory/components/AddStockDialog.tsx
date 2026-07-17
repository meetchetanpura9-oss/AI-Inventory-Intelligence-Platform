import React, { useState } from "react";
import { X, ClipboardEdit, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product";
import { useAddStock } from "../hooks/useAddStock";
import { getFriendlyErrorMessage } from "@/utils/api-error";

interface AddStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductId?: number | null;
}

export function AddStockDialog({ isOpen, onClose, defaultProductId }: AddStockDialogProps) {
  const addStockMutation = useAddStock();

  // Fetch product catalog for dropdown list
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    enabled: isOpen,
  });

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDefaultProductId, setPrevDefaultProductId] = useState(defaultProductId);
  
  if (isOpen !== prevIsOpen || defaultProductId !== prevDefaultProductId) {
    setPrevIsOpen(isOpen);
    setPrevDefaultProductId(defaultProductId);
    if (isOpen) {
      setProductId(defaultProductId ? String(defaultProductId) : (products[0] ? String(products[0].id) : ""));
      setQuantity(0);
      setReference("");
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

    addStockMutation.mutate(
      {
        productId: Number(productId),
        payload: {
          quantity,
          reference: reference.trim() || undefined,
          remarks: remarks.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Stock Added Successfully");
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
          disabled={addStockMutation.isPending}
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2">
          <ClipboardEdit className="size-5.5 text-primary" />
          Add Inventory Stock
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
                disabled={addStockMutation.isPending || !!defaultProductId}
              >
                {products.length === 0 && <option value="">No products available</option>}
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.product_name} ({prod.sku})
                  </option>
                ))}
              </select>
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
              placeholder="e.g. 50"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={addStockMutation.isPending}
            />
          </div>

          {/* Reference */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Reference / PO #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. PO-20384, Manual Count"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={addStockMutation.isPending}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Remarks / Internal Notes</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write any details about this stock addition transaction..."
              className="h-20 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              disabled={addStockMutation.isPending}
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
              disabled={addStockMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addStockMutation.isPending || isLoadingProducts || !productId}
              className="gap-1.5 text-xs font-semibold"
            >
              {addStockMutation.isPending ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Stock"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStockDialog;
