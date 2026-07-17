import { healthSummary } from "../data/mockDashboard";

export function HealthCard() {
  const Icon = healthSummary.icon;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (healthSummary.score / 100) * circumference;

  return (
    <section className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-5 shadow-xl shadow-emerald-950/10 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-200/30 hover:shadow-2xl hover:shadow-emerald-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{healthSummary.label}</h2>
          <p className="mt-1 text-xs text-emerald-100/75" title="Combined stock availability, forecast stability, and replenishment coverage">
            Operational readiness
          </p>
        </div>
        <Icon className="size-5 text-emerald-200" />
      </div>
      <div className="mt-6 flex items-center gap-5">
        <div className="relative size-28 shrink-0">
          <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,.12)" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#22c55e"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-white">
            {healthSummary.score}%
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{healthSummary.status}</p>
          <p className="mt-2 text-sm text-slate-300">
            Stock levels and demand forecasts are aligned for the next operating cycle.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-100">
            <span className="size-2 rounded-full bg-emerald-400" />
            Healthy indicator
          </span>
        </div>
      </div>
    </section>
  );
}
