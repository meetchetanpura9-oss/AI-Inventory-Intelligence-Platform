import React, { useState } from "react";
import { Receipt, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export interface CreatePurchaseFormData {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  supplierContact: string;
  warehouse: string;
  discount: number;
  tax: number;
  shipping: number;
  remarks: string;
}

interface CreatePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  isSubmitting?: boolean;
  onSubmit: (data: CreatePurchaseFormData) => void;
}

const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"];

export function CreatePurchaseDialog({
  isOpen,
  onClose,
  products,
  isSubmitting = false,
  onSubmit,
}: CreatePurchaseDialogProps) {
  const [formData, setFormData] = useState<CreatePurchaseFormData>({
    productId: products[0] ? String(products[0].id) : "",
    quantity: 1,
    unitCost: products[0]?.cost_price || 0,
    supplier: "",
    supplierContact: "",
    warehouse: "Warehouse A",
    discount: 0,
    tax: 0,
    shipping: 0,
    remarks: "",
  });

  if (!isOpen) return null;

  const handleProductChange = (productId: string) => {
    const product = products.find((item) => String(item.id) === productId);
    setFormData((current) => ({
      ...current,
      productId,
      unitCost: product?.cost_price || 0,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.supplier.trim() || !formData.productId || !formData.warehouse) {
      toast.error("Supplier, warehouse, and product are required.");
      return;
    }

    if (formData.quantity <= 0 || formData.unitCost <= 0) {
      toast.error("Quantity and unit cost must be positive values.");
      return;
    }

    if (formData.discount < 0 || formData.tax < 0 || formData.shipping < 0) {
      toast.error("Discount, tax, and shipping cannot be negative.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <Receipt className="size-5 text-primary" />
          Create Purchase
        </h3>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Supplier *</label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(event) => setFormData({ ...formData, supplier: event.target.value })}
                placeholder="Supplier name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Supplier Contact</label>
              <input
                type="text"
                value={formData.supplierContact}
                onChange={(event) => setFormData({ ...formData, supplierContact: event.target.value })}
                placeholder="Email or phone"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Warehouse *</label>
              <select
                required
                value={formData.warehouse}
                onChange={(event) => setFormData({ ...formData, warehouse: event.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse} value={warehouse}>{warehouse}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Product *</label>
              <select
                required
                value={formData.productId}
                onChange={(event) => handleProductChange(event.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(event) => setFormData({ ...formData, quantity: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Unit Cost *</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.unitCost}
                onChange={(event) => setFormData({ ...formData, unitCost: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Discount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={(event) => setFormData({ ...formData, discount: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Tax</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax}
                onChange={(event) => setFormData({ ...formData, tax: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">Shipping</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.shipping}
                onChange={(event) => setFormData({ ...formData, shipping: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94a3b8]">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(event) => setFormData({ ...formData, remarks: event.target.value })}
              rows={3}
              placeholder="Add procurement notes"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <RefreshCw className="size-4 animate-spin" />}
              Create Purchase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePurchaseDialog;
