import React, { useState, useEffect } from "react";
import { Search, RotateCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WarehouseFilter } from "./WarehouseFilter";

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedWarehouse: string;
  onWarehouseChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onAddStockClick: () => void;
  canOperate?: boolean;
}

export function InventoryToolbar({
  searchQuery,
  onSearchChange,
  selectedWarehouse,
  onWarehouseChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
  onAddStockClick,
  canOperate = false,
}: InventoryToolbarProps) {
  // Local state to manage immediate typing, debouncing 500ms to parent handler
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalSearch(searchQuery);
  }

  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/25 p-4.5 shadow-sm backdrop-blur-md md:flex-row md:items-end md:justify-between select-none">
      {/* Filters & Search Input */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end flex-1 max-w-4xl">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Search Product
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search product..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder-[#94a3b8] outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {/* Warehouse Filter */}
        <WarehouseFilter value={selectedWarehouse} onChange={onWarehouseChange} />

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Stock Health
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:mb-0">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="h-10 border-border hover:bg-muted font-medium text-xs px-3 gap-1.5"
          title="Refresh Data"
        >
          <RotateCw className="size-4" />
          <span>Refresh</span>
        </Button>
        {canOperate && (
          <Button
            onClick={onAddStockClick}
            className="h-10 font-semibold text-xs px-4 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4.5" />
            <span>Add Stock</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default InventoryToolbar;
