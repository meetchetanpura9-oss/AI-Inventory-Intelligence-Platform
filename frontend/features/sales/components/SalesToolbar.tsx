import React, { useEffect, useState } from "react";
import { Download, Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRangeFilter, OrderStatus, PaymentStatus } from "../types";

interface SalesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  orderStatus: "All" | OrderStatus;
  onOrderStatusChange: (value: "All" | OrderStatus) => void;
  paymentStatus: "All" | PaymentStatus;
  onPaymentStatusChange: (value: "All" | PaymentStatus) => void;
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

const orderStatuses: Array<"All" | OrderStatus> = ["All", "Processing", "Packed", "Shipped", "Completed", "Cancelled"];
const paymentStatuses: Array<"All" | PaymentStatus> = ["All", "Paid", "Pending", "Failed", "Refunded"];
const dateRanges: DateRangeFilter[] = ["Today", "7 Days", "30 Days", "Custom"];

export function SalesToolbar({
  searchQuery,
  onSearchChange,
  orderStatus,
  onOrderStatusChange,
  paymentStatus,
  onPaymentStatusChange,
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
}: SalesToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="rounded-2xl border border-border bg-card/25 p-4.5 shadow-sm backdrop-blur-md">
      <div className="grid gap-3 xl:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(150px,0.8fr))_auto] xl:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search invoice or customer..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-[#94a3b8] focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(event) => onOrderStatusChange(event.target.value as "All" | OrderStatus)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(event) => onPaymentStatusChange(event.target.value as "All" | PaymentStatus)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Date Filter
          </label>
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as DateRangeFilter)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition hover:bg-muted/40 focus:border-primary"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="h-10 gap-1.5 border-border px-3 text-xs font-semibold hover:bg-muted"
          >
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
              Create
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

export default SalesToolbar;
