import { BrainCircuit, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AiInsight } from "../types/dashboard";

interface AiInsightsProps {
  insight: AiInsight;
}

export function AiInsights({ insight }: AiInsightsProps) {
  return (
    <section className="rounded-xl border border-blue-300/20 bg-gradient-to-br from-blue-600/25 via-cyan-500/10 to-emerald-500/10 p-5 shadow-xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200/30 hover:shadow-2xl hover:shadow-blue-950/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg border border-blue-200/20 bg-blue-300/10 text-blue-100">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{insight.title}</h2>
            <p className="text-xs text-blue-100/75">Forecast engine signal</p>
          </div>
        </div>
        <Badge className="border-blue-200/20 bg-blue-300/10 text-blue-100" variant="outline">
          Recommendation
        </Badge>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-100">{insight.recommendation}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/10 p-3">
          <p className="text-xs text-slate-300">Suggested reorder</p>
          <p className="mt-1 text-lg font-semibold text-white">{insight.reorderQuantity}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 p-3">
          <p className="text-xs text-slate-300">Confidence</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-white">
            <TrendingUp className="size-4 text-emerald-300" />
            {insight.confidence}
          </p>
        </div>
      </div>
    </section>
  );
}
