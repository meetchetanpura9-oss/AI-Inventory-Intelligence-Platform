"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { KPIOverview } from "@/features/analytics/components/KPIOverview";
import { AnalyticsToolbar } from "@/features/analytics/components/AnalyticsToolbar";
import { RevenueChart } from "@/features/analytics/components/RevenueChart";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { PurchaseTrendChart } from "@/features/analytics/components/PurchaseTrendChart";
import { InventoryValueChart } from "@/features/analytics/components/InventoryValueChart";
import { CategoryChart } from "@/features/analytics/components/CategoryChart";
import { TopSellingWidget } from "@/features/analytics/components/TopSellingWidget";
import { LowStockWidget } from "@/features/analytics/components/LowStockWidget";
import { RecentActivityWidget } from "@/features/analytics/components/RecentActivityWidget";
import { ExportDialog } from "@/features/analytics/components/ExportDialog";
import { LoadingSkeleton } from "@/features/analytics/components/LoadingSkeleton";
import { EmptyState } from "@/features/analytics/components/EmptyState";
import type { AnalyticsDateRange } from "@/features/analytics/types";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("Last 30 Days");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [category, setCategory] = useState("All Categories");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filters = useMemo(
    () => ({ dateRange, warehouse, category, customFrom, customTo }),
    [dateRange, warehouse, category, customFrom, customTo]
  );

  const { data, isLoading, isError, refetch } = useAnalytics(filters);

  const renderError = () => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
      <AlertTriangle className="size-12 text-rose-400" />
      <h2 className="mt-4 text-lg font-bold text-foreground">Unable to load analytics.</h2>
      <p className="mt-2 text-sm text-[#94a3b8]">The analytics API is unavailable.</p>
      <Button onClick={() => refetch()} size="sm" className="mt-4 gap-2 font-semibold">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Enterprise business intelligence for revenue, procurement, inventory, and operational health."
      />

      <AnalyticsToolbar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        warehouse={warehouse}
        onWarehouseChange={setWarehouse}
        category={category}
        onCategoryChange={setCategory}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
        onRefresh={() => refetch()}
        onExport={() => setIsExportOpen(true)}
      />

      {isError ? renderError() : isLoading ? <LoadingSkeleton /> : !data ? <EmptyState /> : (
        <>
          <KPIOverview summary={data.summary} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RevenueChart data={data.revenueTrend} />
            <SalesTrendChart data={data.salesTrend} />
            <PurchaseTrendChart data={data.purchaseTrend} />
            <InventoryValueChart data={data.inventoryHealth} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_.9fr]">
            <CategoryChart data={data.categorySales} />
            <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                <Lightbulb className="size-5 text-amber-300" />
                Business Insights
              </h2>
              <div className="mt-4 grid gap-3 text-sm">
                {[
                  ["Highest Revenue Product", data.insights.highest_revenue_product],
                  ["Highest Profit Category", data.insights.highest_profit_category],
                  ["Fastest Moving Product", data.insights.fastest_moving_product],
                  ["Slow Moving Product", data.insights.slow_moving_product],
                  ["Most Active Warehouse", data.insights.most_active_warehouse],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-black/20 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">{label}</p>
                    <p className="mt-1 font-semibold text-[#e2e8f0]">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <TopSellingWidget products={data.topProducts} />
            <LowStockWidget products={data.lowStock} />
            <RecentActivityWidget activities={data.recentActivities} />
          </div>

          <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} dashboard={data} />
        </>
      )}
    </div>
  );
}
