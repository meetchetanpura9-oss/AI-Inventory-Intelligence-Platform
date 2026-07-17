"use client";

import React, { useState } from "react";
import { Bell, Boxes, Receipt, BrainCircuit } from "lucide-react";

const notifications = [
  {
    title: "Low Stock: Milk",
    detail: "Reorder threshold reached",
    time: "2 min ago",
    icon: Boxes,
    color: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20",
  },
  {
    title: "Purchase Approved",
    detail: "PO-1048 approved by Finance",
    time: "5 min ago",
    icon: Receipt,
    color: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20",
  },
  {
    title: "AI Alert",
    detail: "Demand spike: Cold Drinks up 18%",
    time: "10 min ago",
    icon: BrainCircuit,
    color: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20",
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition-all duration-200 hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="size-5" />
        <span className="absolute right-2.5 top-2.5 flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef4444] opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-[#ef4444]" />
        </span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-2 shadow-2xl shadow-black/30">
            <div className="px-3 py-2 border-b border-border mb-1.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <p className="text-[10px] text-[#94a3b8]">3 new inventory signals</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-primary hover:underline font-medium"
              >
                Mark all read
              </button>
            </div>
            <div className="space-y-1">
              {notifications.map(({ title, detail, time, icon: Icon, color }) => (
                <button
                  key={title}
                  type="button"
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted transition-colors"
                >
                  <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border ${color}`}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-1.5">
                      <span className="block truncate text-sm font-medium text-foreground">{title}</span>
                      <span className="block shrink-0 text-[10px] text-[#94a3b8]">{time}</span>
                    </span>
                    <span className="block truncate text-xs text-[#94a3b8] mt-0.5">{detail}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default NotificationBell;
