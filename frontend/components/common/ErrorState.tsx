"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while fetching data. Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[250px] w-full flex-col items-center justify-center rounded-2xl border border-red-900/20 bg-red-950/10 p-6 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-[#ef4444]">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#94a3b8]">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4 border-[#ef4444]/30 hover:bg-[#ef4444]/10 hover:text-white"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
export default ErrorState;
