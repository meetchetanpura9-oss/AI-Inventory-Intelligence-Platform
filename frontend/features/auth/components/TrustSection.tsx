"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { memo, useEffect } from "react";

interface TrustMetric {
  label: string;
  value: number;
  suffix: string;
}

const metrics: TrustMetric[] = [
  { label: "Warehouses", value: 100, suffix: "+" },
  { label: "Products", value: 50, suffix: "K+" },
  { label: "Platform Uptime", value: 99.9, suffix: "%" },
];

function CountUp({ value, suffix }: Pick<TrustMetric, "value" | "suffix">) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 24, damping: 16, mass: 1 });
  const formatted = useTransform(spring, (latest) => {
    const display = value % 1 === 0 ? Math.round(latest).toLocaleString() : latest.toFixed(1);
    return `${display}${suffix}`;
  });

  useEffect(() => {
    count.set(value);
  }, [count, value]);

  return <motion.span>{formatted}</motion.span>;
}

export const TrustSection = memo(function TrustSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
        >
          <p className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            <ChevronRight className="size-3" aria-hidden="true" />
            Trusted by
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            <CountUp value={metric.value} suffix={metric.suffix} />
          </p>
          <p className="text-sm text-slate-400">{metric.label}</p>
        </article>
      ))}
    </div>
  );
});
