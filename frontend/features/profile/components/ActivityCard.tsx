import React from "react";
import { Activity, Clock, ShieldCheck, ShieldAlert, Monitor } from "lucide-react";
import type { ProfileActivity } from "../types";

interface ActivityCardProps {
  activities: ProfileActivity[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Activity className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Login Audit Logs</h3>
          <p className="text-[11px] text-[#94a3b8]">Review recent authentication queries and status flags</p>
        </div>
      </div>

      <div className="overflow-hidden border border-border/40 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-bold tracking-wider border-b border-border/40">
              <tr>
                <th className="px-4 py-3 font-semibold">Device / Browser</th>
                <th className="px-4 py-3 font-semibold">IP Address</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/25">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                  {/* Browser/Device */}
                  <td className="px-4 py-3.5 flex items-center gap-2 text-white font-medium">
                    <Monitor className="size-3.5 text-[#64748b] shrink-0" />
                    <span>{act.browser} ({act.device})</span>
                  </td>

                  {/* IP Address */}
                  <td className="px-4 py-3.5 font-mono text-[11px] text-[#94a3b8]">
                    {act.ip_address || "-"}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-3.5 text-[#94a3b8]">
                    {formatDate(act.timestamp)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                      act.status === "Success" 
                        ? "bg-[#22c55e]/10 text-emerald-400 border border-[#22c55e]/25" 
                        : "bg-[#ef4444]/10 text-rose-400 border border-[#ef4444]/25"
                    }`}>
                      {act.status === "Success" ? (
                        <>
                          <ShieldCheck className="size-3 shrink-0" /> Success
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="size-3 shrink-0" /> Failed
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ActivityCard;
