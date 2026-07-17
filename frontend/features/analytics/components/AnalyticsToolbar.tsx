import React from "react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyticsDateRange } from "../types";

interface AnalyticsToolbarProps {
  dateRange: AnalyticsDateRange;
  onDateRangeChange: (value: AnalyticsDateRange) => void;
  warehouse: string;
  onWarehouseChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

const dateRanges: AnalyticsDateRange[] = ["Today", "Last 7 Days", "Last 30 Days", "Last Quarter", "Custom"];
const warehouses = ["All Warehouses", "Warehouse A", "Warehouse B", "Warehouse C"];
const categories = ["All Categories", "Dairy", "Groceries", "Snacks", "Beverages", "Personal Care"];

export function AnalyticsToolbar({
  dateRange,
  onDateRangeChange,
  warehouse,
  onWarehouseChange,
  category,
  onCategoryChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onRefresh,
  onExport,
}: AnalyticsToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/25 p-4.5 shadow-sm backdrop-blur-md">
      <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(170px,1fr))_auto] lg:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Date Filter</label>
          <select value={dateRange} onChange={(event) => onDateRangeChange(event.target.value as AnalyticsDateRange)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary">
            {dateRanges.map((range) => <option key={range} value={range}>{range}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Warehouse</label>
          <select value={warehouse} onChange={(event) => onWarehouseChange(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary">
            {warehouses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Category</label>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Button variant="outline" onClick={onRefresh} className="h-10 gap-1.5 border-border px-3 text-xs font-semibold hover:bg-muted">
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button onClick={onExport} className="h-10 gap-1.5 px-4 text-xs font-semibold">
            <Download className="size-4" />
            Export Dashboard
          </Button>
        </div>
      </div>
      {dateRange === "Custom" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-lg">
          <input type="date" value={customFrom} onChange={(event) => onCustomFromChange(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary" />
          <input type="date" value={customTo} onChange={(event) => onCustomToChange(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary" />
        </div>
      )}
    </div>
  );
}

export default AnalyticsToolbar;
