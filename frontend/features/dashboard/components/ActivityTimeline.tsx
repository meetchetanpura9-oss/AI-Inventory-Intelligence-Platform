import { cn } from "@/lib/utils";
import { EmptyDashboardState } from "./DashboardStates";
import type { ActivityEvent } from "../types/dashboard";

const statusClasses: Record<ActivityEvent["status"], string> = {
  success: "bg-emerald-400 shadow-emerald-400/30",
  info: "bg-sky-400 shadow-sky-400/30",
  warning: "bg-amber-400 shadow-amber-400/30",
  ai: "bg-violet-400 shadow-violet-400/30",
};

interface ActivityTimelineProps {
  activities: ActivityEvent[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <h2 className="text-base font-semibold text-white">Recent Activity</h2>
      {activities.length === 0 ? (
        <div className="mt-4">
          <EmptyDashboardState title="No recent activity" />
        </div>
      ) : (
        <div className="mt-5 space-y-0">
          {activities.map((activity, index) => (
            <div
              key={`${activity.time}-${activity.title}`}
              className="group relative grid grid-cols-[5rem_1fr] gap-3 pb-5 last:pb-0"
            >
              {index !== activities.length - 1 && (
                <span className="absolute left-[5.55rem] top-5 h-full w-px bg-white/10" aria-hidden="true" />
              )}
              <span className="text-xs text-slate-400">{activity.time}</span>
              <div className="relative rounded-lg border border-transparent p-2 transition group-hover:border-white/10 group-hover:bg-white/[0.04]">
                <span
                  className={cn("absolute -left-[1.16rem] top-3 size-2.5 rounded-full shadow-lg", statusClasses[activity.status])}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-white">{activity.title}</p>
                <p className="mt-1 text-xs text-slate-400">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
