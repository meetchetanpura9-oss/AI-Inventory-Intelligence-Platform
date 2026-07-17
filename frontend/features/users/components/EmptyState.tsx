import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border bg-card/25 rounded-2xl p-8 text-center space-y-4">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
        <User className="size-6" />
      </div>
      <div className="space-y-1.5 select-none">
        <h3 className="text-base font-bold text-white">No users found</h3>
        <p className="text-xs text-[#94a3b8] max-w-sm leading-relaxed">
          Try changing your search terms or adjusting the role and status filters to locate accounts.
        </p>
      </div>
      {onClearFilters && (
        <Button onClick={onClearFilters} size="sm" variant="outline" className="text-xs h-9 border-border hover:bg-muted font-semibold">
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
