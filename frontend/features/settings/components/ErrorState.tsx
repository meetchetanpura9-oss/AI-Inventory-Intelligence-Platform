import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-border bg-card rounded-2xl p-6 text-center space-y-4 max-w-4xl">
      <AlertTriangle className="size-12 text-[#ef4444]" />
      <h2 className="text-lg font-bold text-foreground">Unable to load settings</h2>
      <p className="text-sm text-[#94a3b8]">Could not connect to FastAPI server. Please check backend connection.</p>
      <Button onClick={onRetry} size="sm" className="gap-2">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

export default ErrorState;
