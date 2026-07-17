import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
        </div>
        <Skeleton className="h-10 w-44 bg-white/10 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
        <Skeleton className="h-28 bg-white/10 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 bg-white/10 rounded-xl" />
        <Skeleton className="h-80 bg-white/10 rounded-xl" />
      </div>

      <div className="h-96 bg-white/10 rounded-xl" />
    </div>
  );
}
