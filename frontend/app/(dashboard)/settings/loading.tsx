import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Skeleton className="h-8 w-32 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
      </div>

      <div className="flex gap-2 border-b border-border pb-px">
        <Skeleton className="h-9 w-24 bg-white/10" />
        <Skeleton className="h-9 w-24 bg-white/10" />
        <Skeleton className="h-9 w-24 bg-white/10" />
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-24 w-full bg-white/10 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}
