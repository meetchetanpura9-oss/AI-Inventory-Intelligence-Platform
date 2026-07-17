import React from "react";
import type { LucideIcon } from "lucide-react";

interface TransactionCardProps {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "red" | "amber";
}

const tones = {
  blue: "text-blue-300 bg-blue-500/10",
  green: "text-emerald-300 bg-emerald-500/10",
  red: "text-rose-300 bg-rose-500/10",
  amber: "text-amber-300 bg-amber-500/10",
};

export function TransactionCard({ title, value, detail, icon: Icon, tone = "blue" }: TransactionCardProps) {
  return (
    <div className="rounded-2xl border border-[#223046] bg-[#102235] p-5 shadow-md transition-all duration-200 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#94a3b8]">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-[#94a3b8]">{detail}</p>
    </div>
  );
}

export default TransactionCard;
