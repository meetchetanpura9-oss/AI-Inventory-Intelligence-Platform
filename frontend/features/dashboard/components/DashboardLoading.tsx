import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-36 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return <Skeleton className="h-80 rounded-xl bg-white/10" />;
}

export function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <Skeleton className="h-5 w-36 bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-4/5 bg-white/10" />
    </div>
  );
}
