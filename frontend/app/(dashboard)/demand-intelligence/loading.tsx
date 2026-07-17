import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DemandIntelligenceLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-60 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-96 bg-white/10" />
        </div>
      </div>

      <div className="h-44 bg-white/10 rounded-2xl" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-80 bg-white/10 rounded-xl" />
          <Skeleton className="h-64 bg-white/10 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 bg-white/10 rounded-xl" />
          <Skeleton className="h-40 bg-white/10 rounded-xl" />
          <Skeleton className="h-40 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
