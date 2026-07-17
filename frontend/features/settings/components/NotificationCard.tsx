import React from "react";
import { Bell } from "lucide-react";
import type { NotificationSettings } from "../types";

interface NotificationCardProps {
  values: NotificationSettings;
  onChange: (key: keyof NotificationSettings, value: boolean) => void;
}

export function NotificationCard({ values, onChange }: NotificationCardProps) {
  const toggles = [
    {
      key: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive weekly PDF digest logs and critical summaries in your inbox.",
    },
    {
      key: "browserNotifications" as const,
      label: "Browser Notifications",
      description: "Dispatch urgent alerts directly in the system notification area.",
    },
    {
      key: "lowStockAlerts" as const,
      label: "Low Stock Alerts",
      description: "Fire warning flags whenever stock levels drop below warning thresholds.",
    },
    {
      key: "salesAlerts" as const,
      label: "Sales Alerts",
      description: "Receive realtime updates on customer checkout velocity spikes.",
    },
    {
      key: "purchaseAlerts" as const,
      label: "Purchase Alerts",
      description: "Send status notifications on procurement orders raised to suppliers.",
    },
    {
      key: "aiAlerts" as const,
      label: "AI Alerts",
      description: "Trigger predictive suggestions for stockout ETAs and demand surges.",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Bell className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Notifications Channels</h3>
          <p className="text-[11px] text-[#94a3b8]">Configure warning emails, alerts, and browser triggers</p>
        </div>
      </div>

      <div className="divide-y divide-border/30 pt-1">
        {toggles.map((t) => (
          <div key={t.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white">{t.label}</p>
              <p className="text-[10px] text-[#94a3b8] leading-relaxed max-w-[28rem]">
                {t.description}
              </p>
            </div>
            {/* Styled Switch / Checkbox toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={values[t.key]}
                onChange={(e) => onChange(t.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#94a3b8] after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white peer-checked:after:border-none" />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationCard;
