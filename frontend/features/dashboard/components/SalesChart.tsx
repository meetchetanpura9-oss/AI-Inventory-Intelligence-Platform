"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./ChartPanel";
import type { SalesTrendPoint } from "../types/dashboard";

interface SalesChartProps {
  data: SalesTrendPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ChartPanel title="Sales Trend" description="Daily sales and order velocity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
          <Tooltip
            contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 3 }}
            isAnimationActive
            animationBegin={120}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationBegin={260}
            animationDuration={1100}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
