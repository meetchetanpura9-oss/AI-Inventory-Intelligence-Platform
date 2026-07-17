"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DashboardKpi, KpiTone } from "../types/dashboard";

const toneStyles: Record<KpiTone, string> = {
  blue: "from-blue-500/20 to-sky-400/5 text-blue-100 ring-blue-300/20",
  green: "from-emerald-500/20 to-lime-400/5 text-emerald-100 ring-emerald-300/20",
  amber: "from-amber-500/20 to-yellow-400/5 text-amber-100 ring-amber-300/20",
  violet: "from-violet-500/20 to-fuchsia-400/5 text-violet-100 ring-violet-300/20",
  rose: "from-rose-500/20 to-red-400/5 text-rose-100 ring-rose-300/20",
  cyan: "from-cyan-500/20 to-teal-400/5 text-cyan-100 ring-cyan-300/20",
};

interface KpiCardProps {
  kpi: DashboardKpi;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const Icon = kpi.icon;
  const hasCounter = typeof kpi.countTo === "number";

  return (
    <motion.article
      className={cn(
        "min-h-36 rounded-xl border border-white/10 bg-gradient-to-br p-4 shadow-xl shadow-black/15 ring-1 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25",
        toneStyles[kpi.tone],
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
          <Icon className="size-5" />
        </div>
        <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
          {kpi.trend}
        </Badge>
      </div>
      <div className="mt-5">
        <p className="text-sm text-slate-300">{kpi.label}</p>
        <p className="mt-1 text-2xl font-semibold text-white">
          {hasCounter ? (
            <CountUp
              decimals={kpi.decimals ?? 0}
              decimal="."
              duration={1.35}
              end={kpi.countTo ?? 0}
              prefix={kpi.prefix}
              separator=","
              suffix={kpi.suffix}
            />
          ) : (
            kpi.value
          )}
        </p>
        <p className="mt-2 text-xs text-slate-400">{kpi.detail}</p>
      </div>
    </motion.article>
  );
}
