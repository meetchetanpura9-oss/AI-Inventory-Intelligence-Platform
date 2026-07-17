"use client";

import React from "react";

export function Loading() {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3">
      <div className="size-10 animate-spin rounded-full border-4 border-[#223046] border-t-[#3b82f6]" />
      <p className="text-sm font-medium text-[#94a3b8] animate-pulse">Loading data...</p>
    </div>
  );
}
export default Loading;
