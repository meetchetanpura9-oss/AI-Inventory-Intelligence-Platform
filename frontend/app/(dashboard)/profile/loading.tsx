import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Skeleton className="h-8 w-32 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-60 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-6 flex flex-col items-center">
          <Skeleton className="size-24 rounded-full bg-white/10" />
          <Skeleton className="mt-4 h-5 w-32 bg-white/10" />
          <Skeleton className="mt-1 h-4 w-24 bg-white/10" />
        </div>
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-28 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
