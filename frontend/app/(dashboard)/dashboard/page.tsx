"use client";

import { ActivityTimeline } from "@/features/dashboard/components/ActivityTimeline";
import { AiInsights } from "@/features/dashboard/components/AiInsights";
import { DashboardErrorState } from "@/features/dashboard/components/DashboardStates";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { ChartSkeleton, KpiSkeletonGrid, TableSkeleton } from "@/features/dashboard/components/DashboardLoading";
import { DemandChart } from "@/features/dashboard/components/DemandChart";
import { HealthCard } from "@/features/dashboard/components/HealthCard";
import { InventoryChart } from "@/features/dashboard/components/InventoryChart";
import { LowStockTable } from "@/features/dashboard/components/LowStockTable";
import { MiniChat } from "@/features/dashboard/components/MiniChat";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { TopProducts } from "@/features/dashboard/components/TopProducts";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { data, isError, isLoading } = useDashboard();

  if (isError) {
    return <DashboardErrorState />;
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <KpiSkeletonGrid />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader lastUpdated={data.lastUpdated} />
      <StatsGrid kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SalesChart data={data.salesTrend} />
        <InventoryChart data={data.inventoryHealth} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RevenueChart data={data.revenue} />
        <DemandChart data={data.demand} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr]">
        <AiInsights insight={data.aiInsight} />
        <ActivityTimeline activities={data.activities} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <LowStockTable products={data.lowStock} />
        <TopProducts products={data.topProducts} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <HealthCard />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-1">
          <QuickActions />
          <MiniChat />
        </div>
      </div>
    </div>
  );
}
