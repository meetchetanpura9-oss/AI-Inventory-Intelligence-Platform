import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* 4 Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#223046] bg-[#102235]/45 p-6 space-y-3">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="h-7 w-20 bg-white/10" />
            <Skeleton className="h-3 w-36 bg-white/10" />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="h-20 rounded-2xl border border-border bg-card/25 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 w-64 bg-white/10" />
          <Skeleton className="h-10 w-36 bg-white/10" />
          <Skeleton className="h-10 w-36 bg-white/10" />
          <Skeleton className="h-10 w-24 bg-white/10 ml-auto" />
        </div>
      </div>

      {/* Table block */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-12 bg-white/5 border-b border-border/80" />
        <div className="p-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
