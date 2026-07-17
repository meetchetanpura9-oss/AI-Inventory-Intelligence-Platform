import React from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppearanceCardProps {
  value: "light" | "dark" | "system";
  onChange: (theme: "light" | "dark" | "system") => void;
}

export function AppearanceCard({ value, onChange }: AppearanceCardProps) {
  const options = [
    {
      id: "light" as const,
      label: "Light Mode",
      icon: Sun,
      description: "Clean white aesthetics optimized for daytime usage.",
    },
    {
      id: "dark" as const,
      label: "Dark Mode",
      icon: Moon,
      description: "Relaxed deep blue theme optimized for night-time work.",
    },
    {
      id: "system" as const,
      label: "System Theme",
      icon: Monitor,
      description: "Automatically synchronizes with your device preference.",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Palette className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Appearance & Branding</h3>
          <p className="text-[11px] text-[#94a3b8]">Personalize your visual display workspace theme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-muted/10",
                isSelected 
                  ? "bg-primary/5 border-primary shadow-md shadow-primary/5" 
                  : "border-border bg-card/25"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-[#94a3b8]"
                )}>
                  <Icon className="size-4.5" />
                </div>
                <div className={cn(
                  "size-4 rounded-full border flex items-center justify-center",
                  isSelected ? "border-primary" : "border-border"
                )}>
                  {isSelected && <div className="size-2 rounded-full bg-primary" />}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{opt.label}</h4>
                <p className="text-[10px] text-[#94a3b8] mt-1 leading-normal">
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AppearanceCard;
