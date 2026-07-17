"use client";

import React, { type ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AnalyticsCard({ title, subtitle, children, actions }: AnalyticsCardProps) {
  return (
    <div className="rounded-2xl border border-[#223046] bg-[#102235] p-6 shadow-md">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-[#94a3b8]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="relative min-h-[300px] w-full">{children}</div>
    </div>
  );
}
export default AnalyticsCard;
