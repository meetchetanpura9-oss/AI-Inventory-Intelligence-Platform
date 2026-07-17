import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl select-none animate-pulse">
      {/* Tab select skeleton */}
      <div className="flex border-b border-border gap-2 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 bg-white/10" />
        ))}
      </div>

      {/* Cards list skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Skeleton className="size-5 bg-white/10 rounded" />
            <Skeleton className="h-4 w-40 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-3 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action buttons skeleton */}
      <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
        <Skeleton className="h-10 w-24 bg-white/10" />
        <Skeleton className="h-10 w-32 bg-white/10" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
