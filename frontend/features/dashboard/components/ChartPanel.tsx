import type { ReactNode } from "react";

interface ChartPanelProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ChartPanel({ title, description, children }: ChartPanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/25">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <div className="h-72 min-h-72 w-full">{children}</div>
    </section>
  );
}
