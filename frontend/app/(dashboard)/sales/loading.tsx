import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-72 bg-white/10 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 bg-white/10 rounded-xl" />
          <Skeleton className="h-36 bg-white/10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-3/4 bg-white/10" />
      </div>
    </div>
  );
}
