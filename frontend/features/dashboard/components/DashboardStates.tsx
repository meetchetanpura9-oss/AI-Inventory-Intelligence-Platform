import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDashboardState({ title }: { title: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
      <Inbox className="size-8 text-slate-400" />
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">New events will appear here as data arrives.</p>
    </div>
  );
}

export function DashboardErrorState() {
  return (
    <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-5 text-red-100">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5" />
        <div>
          <p className="font-medium">Failed to load dashboard</p>
          <p className="mt-1 text-sm text-red-100/75">The UI is ready; reconnect the data source and try again.</p>
          <Button className="mt-4" size="sm" variant="destructive">
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
