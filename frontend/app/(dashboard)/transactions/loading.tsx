import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <Skeleton className="h-8 w-64 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-80 bg-white/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-2xl bg-white/10" />
      <Skeleton className="h-96 rounded-2xl bg-white/10" />
    </div>
  );
}
