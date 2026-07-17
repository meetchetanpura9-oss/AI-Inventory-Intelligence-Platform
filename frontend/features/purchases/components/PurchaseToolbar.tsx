import React, { useEffect, useState } from "react";
import { Download, Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRangeFilter, PurchasePaymentStatus, PurchaseStatus } from "../types";

interface PurchaseToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  purchaseStatus: "All" | PurchaseStatus;
  onPurchaseStatusChange: (value: "All" | PurchaseStatus) => void;
  paymentStatus: "All" | PurchasePaymentStatus;
  onPaymentStatusChange: (value: "All" | PurchasePaymentStatus) => void;
  warehouse: string;
  onWarehouseChange: (value: string) => void;
  dateRange: DateRangeFilter;
  onDateRangeChange: (value: DateRangeFilter) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onCreate: () => void;
  canCreate?: boolean;
}

const purchaseStatuses: Array<"All" | PurchaseStatus> = ["All", "Pending", "Processing", "Ordered", "Received", "Cancelled"];
const paymentStatuses: Array<"All" | PurchasePaymentStatus> = ["All", "Paid", "Pending", "Partially Paid"];
const warehouses = ["All Warehouses", "Warehouse A", "Warehouse B", "Warehouse C"];
const dateRanges: DateRangeFilter[] = ["Today", "Last 7 Days", "Last 30 Days", "Custom"];

export function PurchaseToolbar({
  searchQuery,
  onSearchChange,
  purchaseStatus,
  onPurchaseStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  warehouse,
  onWarehouseChange,
  dateRange,
  onDateRangeChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onRefresh,
  onExport,
  onCreate,
  canCreate = false,
}: PurchaseToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="rounded-2xl border border-border bg-card/25 p-4.5 shadow-sm backdrop-blur-md">
      <div className="grid gap-3 xl:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(145px,0.75fr))_auto] xl:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search supplier, PO number..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-[#94a3b8] focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Purchase Status</label>
          <select
            value={purchaseStatus}
            onChange={(event) => onPurchaseStatusChange(event.target.value as "All" | PurchaseStatus)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {purchaseStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(event) => onPaymentStatusChange(event.target.value as "All" | PurchasePaymentStatus)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Warehouse</label>
          <select
            value={warehouse}
            onChange={(event) => onWarehouseChange(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {warehouses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Date Filter</label>
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as DateRangeFilter)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <Button variant="outline" onClick={onRefresh} className="h-10 gap-1.5 border-border px-3 text-xs font-semibold hover:bg-muted">
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button onClick={onExport} className="h-10 gap-1.5 px-4 text-xs font-semibold">
            <Download className="size-4" />
            Export
          </Button>
          {canCreate && (
            <Button onClick={onCreate} className="h-10 gap-1.5 px-4 text-xs font-semibold">
              <Plus className="size-4" />
              Create Purchase
            </Button>
          )}
        </div>
      </div>

      {dateRange === "Custom" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-lg">
          <input
            type="date"
            value={customFrom}
            onChange={(event) => onCustomFromChange(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <input
            type="date"
            value={customTo}
            onChange={(event) => onCustomToChange(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}

export default PurchaseToolbar;
