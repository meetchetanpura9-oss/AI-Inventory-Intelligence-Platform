"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  Brain,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiDatasetService } from "@/features/ai/services/aiDatasetService";

export default function FestivalIntelligencePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([]);
  const [festivalContext, setFestivalContext] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [upcoming, context, recs] = await Promise.all([
        aiDatasetService.getUpcomingFestivals(),
        aiDatasetService.getAIContext(),
        aiDatasetService.getAIRecommendations()
      ]);
      setUpcomingFestivals(upcoming);
      setFestivalContext(context.festival);
      setRecommendations(recs.filter((r: any) => r.type === "Festival Countdown"));
    } catch (err) {
      toast.error("Failed to load festival intelligence data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast.success("Festival calendar and demand multipliers recalculated successfully!");
  };

  // Recharts Data mapping
  const CHART_DATA = upcomingFestivals.slice(0, 6).map(f => ({
    name: f.name,
    increase: Math.round((f.expected_increase - 1.0) * 100)
  }));

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Clock className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <PageHeader 
          title="AI Festival Intelligence Calendar" 
          description="Pre-empting consumer demand spikes by aligning order cycles to cultural events and calendar peaks." 
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Recalculate Multipliers
        </Button>
      </div>

      {/* Festival Countdown KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Active Festival status</span>
            <Sparkles className="size-4 text-[#fbbf24]" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">
              {festivalContext?.in_festival ? festivalContext.festival_name : "No Active Festival"}
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              {festivalContext?.in_festival ? "Currently in peak demand window" : "Stable baseline operations"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Next Upcoming Peak</span>
            <Calendar className="size-4 text-blue-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{festivalContext?.festival_name || "New Year"}</h3>
            <span className="text-[10px] text-[#94a3b8] font-semibold block mt-1">
              Indian Calendar Config (2026)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Countdown / Days Left</span>
            <Clock className="size-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{festivalContext?.days_left} Days</h3>
            <span className={`text-[10px] font-bold block mt-1 ${festivalContext?.days_left <= 10 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}>
              {festivalContext?.days_left <= 10 ? "Triggers active multiplier" : "Outside trigger window"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Active Demand Multiplier</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{festivalContext?.multiplier}x</h3>
            <Badge variant="outline" className="mt-1 border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
              Multiplies Recommendation Score
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Upcoming Peaks List & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Festival Peaks Table */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" />
                Upcoming Festival Peaks & Impacts
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Complete cultural event pipeline mapping with expected category demand multipliers.
              </p>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="w-full text-xs text-left text-[#94a3b8]">
                <thead className="text-[10px] uppercase font-bold text-[#64748b] bg-secondary/20 border-b border-border/60">
                  <tr>
                    <th className="px-4 py-3">Festival</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Peak Surge</th>
                    <th className="px-4 py-3">Affected Categories</th>
                    <th className="px-4 py-3 text-right">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {upcomingFestivals.map((f, idx) => (
                    <tr key={idx} className="hover:bg-secondary/5 transition-all">
                      <td className="px-4 py-3 font-semibold text-foreground">{f.name}</td>
                      <td className="px-4 py-3">{f.category}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-400">
                        +{Math.round((f.expected_increase - 1.0) * 100)}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {f.affected_categories.map((c: string) => (
                            <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground/80 font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        {f.days_left} Days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Festival Surge Chart */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-5 text-[#22c55e]" />
                Expected Demand Surge by Festival Event
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Visualizing expected percentage order volume increases for upcoming festivals.
              </p>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} label={{ value: "Surge (%)", angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar name="Expected Demand Increase (%)" dataKey="increase" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Side: AI recommendations & Festival Alerts */}
        <div className="space-y-6">
          {/* Active Trigger Warning */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-400 animate-pulse" />
                Active Trigger Thresholds
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Countdown intelligence scaling formula.</p>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed text-[#94a3b8]">
              <p>
                The AI engine scans upcoming festivals daily. When a high-impact festival falls within **10 days**, a dynamic scaling factor is applied:
              </p>
              <div className="p-3 bg-secondary/30 rounded-lg font-mono text-center text-foreground font-bold text-[10px] border border-border/40">
                Multiplier = 1.0 + (Surge - 1.0) * (10 - Days) / 10
              </div>
              <p>
                This ensures that purchase orders ramp up steadily to build safety stocks before supply chain logistics saturate.
              </p>
            </div>
          </section>

          {/* AI Recommendations */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Brain className="size-5 text-[#22c55e]" />
                Festival Replenishment Orders
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Smart replenishment actions suggested for upcoming festive spikes.</p>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-secondary/15 border border-border/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-foreground">{rec.product}</span>
                    <Badge variant="outline" className="text-[9px] font-bold border-amber-500/20 text-amber-400 bg-amber-500/5">
                      {rec.multiplier}x Surge
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[#94a3b8]">{rec.reason}</p>
                  <div className="text-[10px] text-foreground font-semibold flex items-center gap-1.5 pt-1 border-t border-border/10">
                    <CheckCircle className="size-3 text-[#22c55e] shrink-0" />
                    <span>Action: {rec.recommendation}</span>
                  </div>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-xs text-[#94a3b8] text-center py-4">No active festive triggers. Standard safety thresholds apply.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
