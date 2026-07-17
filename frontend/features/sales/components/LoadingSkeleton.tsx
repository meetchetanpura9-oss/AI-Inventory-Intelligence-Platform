import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-10 w-full bg-white/10" />
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full bg-white/10" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
