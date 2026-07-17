"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  lastUpdated: string;
}

export function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <motion.section
      className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="min-w-0">
        <Badge className="mb-3 border-cyan-300/30 bg-cyan-400/10 text-cyan-100" variant="outline">
          AI operations center
        </Badge>
        <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">
          <span className="bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
            Good Morning, Meet
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Welcome back to your AI Inventory Intelligence Platform
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">{date}</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">{time}</span>
          <span className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-emerald-100">
            Last updated: {lastUpdated}
          </span>
        </div>
        <Button className="w-fit shadow-lg shadow-blue-950/30" size="sm">
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
    </motion.section>
  );
}
