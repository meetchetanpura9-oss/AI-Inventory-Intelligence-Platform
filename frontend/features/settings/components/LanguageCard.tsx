import React from "react";
import { Globe } from "lucide-react";

interface LanguageCardProps {
  value: "en" | "hi" | "gu";
  onChange: (language: "en" | "hi" | "gu") => void;
}

export function LanguageCard({ value, onChange }: LanguageCardProps) {
  const languages = [
    { code: "en" as const, label: "English", nativeName: "English (US)" },
    { code: "hi" as const, label: "Hindi", nativeName: "हिन्दी (Hindi)" },
    { code: "gu" as const, label: "Gujarati", nativeName: "ગુજરાતી (Gujarati)" },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Globe className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Language & Regionalization</h3>
          <p className="text-[11px] text-[#94a3b8]">Select your default localization language preference</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm pt-1">
        <label htmlFor="lang-select" className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
          Select System Language
        </label>
        <select
          id="lang-select"
          value={value}
          onChange={(e) => onChange(e.target.value as any)}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default LanguageCard;
