import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
        </div>
        <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:max-w-md bg-white/10 rounded-full" />
        <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
        <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-3/4 bg-white/10" />
      </div>
    </div>
  );
}
