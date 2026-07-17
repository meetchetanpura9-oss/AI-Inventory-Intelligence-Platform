import React from "react";
import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "./ProductSearch";
import { ProductFilter } from "./ProductFilter";

interface ProductToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onAddClick: () => void;
  onRefreshClick: () => void;
  categories: string[];
  canAdd?: boolean;
}

export function ProductToolbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onAddClick,
  onRefreshClick,
  categories,
  canAdd = false,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-border bg-card/25 p-4 shadow-sm backdrop-blur-md">
      {/* Search & Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center flex-1">
        <ProductSearch value={searchQuery} onChange={onSearchChange} />
        <ProductFilter
          category={selectedCategory}
          onCategoryChange={onCategoryChange}
          status={selectedStatus}
          onStatusChange={onStatusChange}
          categories={categories}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onRefreshClick}
          className="h-10 border-border hover:bg-muted font-medium text-xs px-3 gap-1.5"
        >
          <RotateCw className="size-4" />
          <span>Refresh</span>
        </Button>
        {canAdd && (
          <Button
            onClick={onAddClick}
            className="h-10 font-semibold text-xs px-4 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4.5" />
            <span>Add Product</span>
          </Button>
        )}
      </div>
    </div>
  );
}
export default ProductToolbar;
