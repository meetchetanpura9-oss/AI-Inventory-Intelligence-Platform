import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-32 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-64 bg-white/10" />
        </div>
        <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Skeleton className="h-24 bg-white/10 rounded-xl" />
        <Skeleton className="h-24 bg-white/10 rounded-xl" />
        <Skeleton className="h-24 bg-white/10 rounded-xl" />
        <Skeleton className="h-24 bg-white/10 rounded-xl" />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-3/4 bg-white/10" />
      </div>
    </div>
  );
}
