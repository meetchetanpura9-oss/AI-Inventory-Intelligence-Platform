"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SalesTrend } from "../types";

export function SalesTrendChart({ data }: { data: SalesTrend[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Sales Trend</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Daily sales and order velocity</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,.14)" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
            <Tooltip contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
            <Line type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesTrendChart;
