import React from "react";
import { Settings } from "lucide-react";
import type { GeneralSettings } from "../types";

interface GeneralCardProps {
  values: GeneralSettings;
  onChange: (key: keyof GeneralSettings, value: string) => void;
}

export function GeneralCard({ values, onChange }: GeneralCardProps) {
  const currencies = [
    { code: "INR", label: "INR (₹)" },
    { code: "USD", label: "USD ($)" },
    { code: "EUR", label: "EUR (€)" },
  ];

  const timeZones = [
    { value: "Asia/Kolkata", label: "Kolkata (IST - GMT+5:30)" },
    { value: "UTC", label: "UTC (GMT+0:00)" },
    { value: "America/New_York", label: "New York (EST - GMT-5:00)" },
    { value: "Europe/London", label: "London (GMT+0:00)" },
  ];

  const dateFormats = [
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (e.g. 15/07/2026)" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (e.g. 07/15/2026)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (e.g. 2026-07-15)" },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Settings className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">General Parameters</h3>
          <p className="text-[11px] text-[#94a3b8]">Manage platform identity and regional system standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Organization Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="org-name" className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Organization Name
          </label>
          <input
            id="org-name"
            type="text"
            placeholder="e.g. Acme Corp"
            value={values.organizationName}
            onChange={(e) => onChange("organizationName", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
          />
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1">
          <label htmlFor="currency-select" className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Primary Currency
          </label>
          <select
            id="currency-select"
            value={values.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Zone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="timezone-select" className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            System Timezone
          </label>
          <select
            id="timezone-select"
            value={values.timeZone}
            onChange={(e) => onChange("timeZone", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {timeZones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div className="flex flex-col gap-1">
          <label htmlFor="dateformat-select" className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Date Layout Format
          </label>
          <select
            id="dateformat-select"
            value={values.dateFormat}
            onChange={(e) => onChange("dateFormat", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {dateFormats.map((df) => (
              <option key={df.value} value={df.value}>
                {df.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default GeneralCard;
