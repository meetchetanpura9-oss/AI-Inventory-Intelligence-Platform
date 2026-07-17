"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DemandTrend } from "../types";

interface DemandTrendChartProps {
  data?: DemandTrend[];
}

export function DemandTrendChart({ data }: DemandTrendChartProps) {
  // Generate mock history if no timeline is provided
  const chartData = data && data.length > 0 ? data : Array.from({ length: 30 }).map((_, idx) => {
    const day = idx + 1;
    const scoreVal = Math.round(70 + Math.sin(day / 3) * 15 + Math.cos(day / 2) * 5 + (day % 4 === 0 ? 8 : -3));
    return {
      date: `Jul ${day.toString().padStart(2, "0")}`,
      demand_score: Math.min(150, Math.max(20, scoreVal)),
    };
  });

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none">
      <h2 className="text-base font-bold text-white">Demand Trends (Last 30 Days)</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">AI intelligence score velocity</p>
      
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tickLine={false} 
              axisLine={false} 
              className="text-[10px]" 
            />
            <YAxis 
              stroke="#94a3b8" 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`} 
              className="text-[10px]" 
            />
            <Tooltip 
              contentStyle={{ 
                background: "#0f172a", 
                border: "1px solid rgba(255,255,255,.12)", 
                borderRadius: 12 
              }} 
              labelStyle={{ color: "#f8fafc", fontWeight: "bold" }} 
              itemStyle={{ color: "#38bdf8" }}
            />
            <Line 
              type="monotone" 
              dataKey="demand_score" 
              name="Demand Score" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ fill: "#3b82f6", strokeWidth: 1, r: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default DemandTrendChart;
