import React from "react";
import { UserX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border bg-card/25 rounded-2xl p-8 text-center space-y-4 max-w-4xl select-none">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
        <UserX className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">No profile data available</h3>
        <p className="text-xs text-[#94a3b8] max-w-xs leading-relaxed">
          Please check your login session token or authenticate again.
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
