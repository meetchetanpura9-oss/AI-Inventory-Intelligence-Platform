import React from "react";
import type { DashboardActivity } from "../types";

export function RecentActivityWidget({ activities }: { activities: DashboardActivity[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Recent Activity</h2>
      <div className="mt-4 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="grid grid-cols-[48px_1fr] gap-3">
            <span className="text-xs font-bold text-primary">{activity.time}</span>
            <div className="border-l border-border pl-3">
              <p className="text-sm font-bold text-white">{activity.title}</p>
              <p className="mt-1 text-xs text-[#94a3b8]">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentActivityWidget;
