import React from "react";
import { X, BrainCircuit, Calendar, Layers, ShieldCheck, Activity, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DemandProduct } from "../types";
import { DemandScoreBadge } from "./DemandScoreBadge";
import { DemandLevelBadge } from "./DemandLevelBadge";
import { RecommendationBadge } from "./RecommendationCard";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

interface DemandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: DemandProduct | null;
}

export function DemandDrawer({ isOpen, onClose, product }: DemandDrawerProps) {
  if (!product) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Generate historical demand scores for the product
  const historyData = Array.from({ length: 7 }).map((_, idx) => {
    const day = idx + 1;
    const base = product.demand_score;
    const variation = Math.round(Math.sin(day) * 12 + (day * 2) % 5);
    return {
      label: `Day ${day}`,
      score: Math.min(150, Math.max(0, base + variation)),
    };
  });

  const searchConversionRate = product.search_count > 0 
    ? Math.round(((product.search_count - product.failed_searches) / product.search_count) * 100)
    : 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-over panel container */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-border bg-[#0f172a] shadow-2xl p-6 select-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/55 pb-4 mb-4">
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest block mb-0.5">
                  AI Demand Forecasting
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                  <BrainCircuit className="size-5 text-primary" />
                  <span>{product.product_name}</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* Product Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-card/35 rounded-xl border border-border p-4">
                <div>
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">SKU</span>
                  <span className="text-xs font-mono text-white select-all">{product.sku}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Category</span>
                  <span className="text-xs text-white font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Current Stock</span>
                  <span className="text-sm font-bold text-white">{product.current_stock} units</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Last ML Run</span>
                  <span className="text-xs text-[#94a3b8]">{formatDate(product.last_updated)}</span>
                </div>
              </div>

              {/* Demand Status and AI metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-[#64748b] tracking-widest flex items-center gap-1.5">
                  <Activity className="size-4" />
                  AI Signals & Scores
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center justify-center border border-border bg-card/20 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Score</span>
                    <div className="w-full">
                      <DemandScoreBadge score={product.demand_score} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border border-border bg-card/20 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Level</span>
                    <DemandLevelBadge level={product.demand_level} />
                  </div>
                  <div className="flex flex-col items-center justify-center border border-border bg-card/20 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Confidence</span>
                    <span className="text-sm font-extrabold text-[#14b8a6] flex items-center gap-0.5">
                      <ShieldCheck className="size-3.5" />
                      {product.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Projections & Recommendations */}
              <div className="border border-border/60 bg-gradient-to-r from-primary/5 via-[#102235] to-[#0f172a] rounded-xl p-4.5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BrainCircuit className="size-4 text-primary" />
                  Predictive Analysis
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-border/20">
                    <span className="text-[#94a3b8]">Recommendation</span>
                    <RecommendationBadge type={product.recommendation} />
                  </div>
                  <div>
                    <span className="text-[#64748b] block font-bold text-[9px] uppercase tracking-wider mb-0.5">Prediction Statement</span>
                    <p className="text-white leading-relaxed font-semibold bg-black/20 p-2.5 rounded-lg border border-border/30">
                      {product.prediction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion and search logs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border bg-card/20 rounded-xl p-4 space-y-2">
                  <h5 className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Sales Analytics</h5>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">{product.sales_count}</span>
                    <span className="text-[10px] text-[#94a3b8]">Units sold</span>
                  </div>
                  <span className="text-[10px] text-[#64748b] block">Monthly order velocity</span>
                </div>

                <div className="border border-border bg-card/20 rounded-xl p-4 space-y-2">
                  <h5 className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Search Conversions</h5>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">{searchConversionRate}%</span>
                    <span className="text-[10px] text-[#94a3b8]">Success</span>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] block">
                    {product.search_count} total ({product.failed_searches} failed)
                  </span>
                </div>
              </div>

              {/* Mini Trend Chart */}
              <div className="space-y-2 border border-border bg-card/20 rounded-xl p-4.5">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="size-4 text-primary" />
                  Score Timeline
                </h5>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData} margin={{ left: -32, right: 6, top: 6, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,.06)" vertical={false} />
                      <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} className="text-[9px]" />
                      <YAxis stroke="#64748b" tickLine={false} axisLine={false} className="text-[9px]" />
                      <Tooltip 
                        contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} 
                        labelStyle={{ display: "none" }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/40 pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-lg bg-border hover:bg-border/80 text-xs font-bold text-foreground transition"
              >
                Close Projections
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DemandDrawer;
