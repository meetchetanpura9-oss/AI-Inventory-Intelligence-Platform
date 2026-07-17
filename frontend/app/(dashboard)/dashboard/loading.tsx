import React from "react";
import { KpiSkeletonGrid, ChartSkeleton, TableSkeleton } from "@/features/dashboard/components/DashboardLoading";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-48 rounded bg-white/10 animate-pulse" />
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
