import React from "react";

interface ProductFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  categories: string[];
}

export function ProductFilter({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
}: ProductFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Stock Status Dropdown */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
      >
        <option value="All">All Statuses</option>
        <option value="Safe">In Stock (Safe)</option>
        <option value="Warning">Low Stock</option>
        <option value="Critical">Out of Stock</option>
      </select>
    </div>
  );
}
export default ProductFilter;
