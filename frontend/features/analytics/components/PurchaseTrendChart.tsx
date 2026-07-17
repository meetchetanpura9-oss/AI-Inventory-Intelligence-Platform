"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PurchaseTrend } from "../types";

export function PurchaseTrendChart({ data }: { data: PurchaseTrend[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Purchase Trend</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Procurement spend and order movement</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="purchaseTrend" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,.14)" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
            <Tooltip contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
            <Area type="monotone" dataKey="purchases" stroke="#f59e0b" strokeWidth={3} fill="url(#purchaseTrend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PurchaseTrendChart;
