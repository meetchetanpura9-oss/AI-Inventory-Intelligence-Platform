import { KpiCard } from "./KpiCard";
import type { DashboardKpi } from "../types/dashboard";

interface StatsGridProps {
  kpis: DashboardKpi[];
}

export function StatsGrid({ kpis }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </section>
  );
}
