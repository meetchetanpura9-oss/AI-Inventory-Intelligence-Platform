import React, { useState, useEffect } from "react";
import { Package, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product, CreateProduct } from "../types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProduct) => void;
  initialData?: Product | null;
  isSubmitting: boolean;
}

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ProductFormProps) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [unit, setUnit] = useState("pcs");

  // Sync with initialData (edit mode vs add mode)
  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (initialData) {
        setSku(initialData.sku);
        setName(initialData.product_name);
        setBrand(initialData.brand || "");
        setCategory(initialData.category || "Electronics");
        setDescription(initialData.description || "");
        setSellingPrice(initialData.selling_price ?? 0);
        setCostPrice(initialData.cost_price ?? 0);
        setMrp(initialData.mrp || 0);
        setUnit(initialData.unit || "pcs");
      } else {
        setSku("");
        setName("");
        setBrand("");
        setCategory("Electronics");
        setDescription("");
        setSellingPrice(0);
        setCostPrice(0);
        setMrp(0);
        setUnit("pcs");
      }
    }, 0);

    return () => window.clearTimeout(handler);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || sellingPrice <= 0) {
      toast.error("Please fill in SKU, Product Name, and a valid Selling Price.");
      return;
    }
    if (mrp && sellingPrice > mrp) {
      toast.error("Selling Price cannot exceed Maximum Retail Price (MRP).");
      return;
    }
    if (costPrice && costPrice > sellingPrice) {
      toast.error("Cost Price cannot exceed the Selling Price.");
      return;
    }

    onSubmit({
      sku: sku.trim().toUpperCase(),
      product_name: name.trim(),
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      description: description.trim() || undefined,
      price: sellingPrice,
      selling_price: sellingPrice,
      cost_price: costPrice,
      mrp: mrp || undefined,
      unit: unit.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border/40 pb-2">
          <Package className="size-5.5 text-primary" />
          {initialData ? "Edit Product Details" : "Register New Product"}
        </h3>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">SKU Code *</label>
              <input
                type="text"
                required
                disabled={!!initialData}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. ELEC-005"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smart Watch v3"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Brand / Manufacturer</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. TechCorp"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Category *</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Electronics">Electronics</option>
                <option value="Food">Food</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Medicine">Medicine</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Cost Price (Rs.) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                value={costPrice || ""}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                placeholder="0.00"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Selling Price (Rs.) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                value={sellingPrice || ""}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                placeholder="0.00"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">MRP (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={mrp || ""}
                onChange={(e) => setMrp(Number(e.target.value))}
                placeholder="0.00"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8]">Unit (Measure)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. pcs, kgs"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product description for internal catalog users."
              className="h-20 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-border hover:bg-muted text-xs"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 text-xs font-semibold"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Saving...
                </>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProductForm;
