import React from "react";
import { BarChart3 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BarChart3 className="size-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">No Analytics Available</h3>
      <p className="mt-2 max-w-sm text-xs text-[#94a3b8]">Try another date range.</p>
    </div>
  );
}

export default EmptyState;
