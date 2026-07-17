"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/common/ErrorState";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for debugging
    console.error("Dashboard Boundary Caught Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorState
          title="Section Loading Failed"
          message={error.message || "There was a problem loading this part of the application. Please try reloading."}
          onRetry={reset}
        />
      </div>
    </div>
  );
}
