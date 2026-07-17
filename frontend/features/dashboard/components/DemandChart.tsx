"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./ChartPanel";
import type { DemandPoint } from "../types/dashboard";

interface DemandChartProps {
  data: DemandPoint[];
}

export function DemandChart({ data }: DemandChartProps) {
  return (
    <ChartPanel title="Demand Intelligence" description="Predicted category demand score">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="category" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Bar
            dataKey="demand"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationBegin={120}
            animationDuration={950}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
