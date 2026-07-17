"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { InventoryHealth } from "../types";

export function InventoryValueChart({ data }: { data: InventoryHealth[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Inventory Value</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Warehouse-wise inventory value</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,.14)" vertical={false} />
            <XAxis dataKey="warehouse" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
            <Tooltip contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
            <Bar dataKey="inventory_value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default InventoryValueChart;
