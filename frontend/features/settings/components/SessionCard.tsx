import React from "react";
import { Laptop, Clock, Server, Eye } from "lucide-react";
import type { SessionInfo } from "../types";

interface SessionCardProps {
  sessions: SessionInfo[];
}

export function SessionCard({ sessions }: SessionCardProps) {
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
        <Laptop className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Active Session Information</h3>
          <p className="text-[11px] text-[#94a3b8]">Review browser device access history logs</p>
        </div>
      </div>

      <div className="divide-y divide-border/30 pt-1">
        {sessions.map((sess, idx) => (
          <div key={sess.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Laptop className="size-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {sess.browser} on {sess.os}
                  {idx === 0 && (
                    <span className="ml-2 inline-flex items-center text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      This Device
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-[#64748b] mt-0.5 font-mono">
                  <span className="flex items-center gap-0.5">
                    <Server className="size-3" />
                    IP: {sess.ipAddress}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="size-3" />
                    Logged in: {formatDate(sess.loginTime)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] sm:text-right font-medium pl-10 sm:pl-0">
              <Eye className="size-3.5 text-[#64748b]" />
              <span>Last active: {formatDate(sess.lastActivity)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SessionCard;
