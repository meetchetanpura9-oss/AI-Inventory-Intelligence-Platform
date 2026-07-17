import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl select-none animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div className="h-28 w-full bg-white/5" />
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between px-6 pb-6 -mt-10 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <Skeleton className="size-20 rounded-full bg-white/10 border-4 border-[#0f172a]" />
            <div className="space-y-2 text-center sm:text-left">
              <Skeleton className="h-5 w-44 bg-white/10" />
              <Skeleton className="h-3.5 w-36 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 bg-white/10" />
        </div>
      </div>

      {/* Profile details grid skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-white/10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
