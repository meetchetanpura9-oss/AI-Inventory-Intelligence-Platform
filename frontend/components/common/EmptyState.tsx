"use client";

import React, { type ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "No Data Found",
  description = "Get started by adding new entries or importing records.",
  icon = <Inbox className="size-10 text-[#94a3b8]" />,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#223046] bg-[#102235]/40 p-8 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#102235]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#94a3b8]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export default EmptyState;
