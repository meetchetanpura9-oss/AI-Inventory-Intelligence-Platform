"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BrainCircuit, Gauge, RefreshCw } from "lucide-react";
import { memo, useEffect } from "react";

interface KPIItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: typeof Gauge;
}

const kpis: KPIItem[] = [
  { label: "Forecast Accuracy", value: 96, suffix: "%", icon: Gauge },
  { label: "Inventory Turnover", value: 21, prefix: "+", suffix: "%", icon: RefreshCw },
  { label: "Prediction Confidence", value: 98, suffix: "%", icon: BrainCircuit },
];

function AnimatedMetric({ value, prefix = "", suffix = "" }: Omit<KPIItem, "label" | "icon">) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 32, damping: 18, mass: 0.9 });
  const rounded = useTransform(spring, (latest) => `${prefix}${Math.round(latest)}${suffix}`);

  useEffect(() => {
    count.set(value);
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export const KPICards = memo(function KPICards() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
      {kpis.map(({ label, value, prefix, suffix, icon: Icon }) => (
        <motion.article
          key={label}
          whileHover={reduceMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
        >
          <div className="absolute inset-x-8 -top-10 h-16 rounded-full bg-blue-400/12 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                <AnimatedMetric value={value} prefix={prefix} suffix={suffix} />
              </p>
              <p className="mt-2 text-xs leading-4 text-slate-400">{label}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-2xl bg-blue-400/12 text-blue-100 transition-transform duration-300 group-hover:rotate-3">
              <Icon className="size-4" aria-hidden="true" />
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
});
