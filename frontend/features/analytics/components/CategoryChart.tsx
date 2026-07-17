"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySales } from "../types";

const colors = ["#38bdf8", "#22c55e", "#f59e0b", "#a78bfa", "#f43f5e"];

export function CategoryChart({ data }: { data: CategorySales[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h2 className="text-base font-bold text-white">Category Performance</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Revenue distribution by category</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={58} outerRadius={96} paddingAngle={3}>
              {data.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-[#94a3b8]">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            {item.category}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryChart;
