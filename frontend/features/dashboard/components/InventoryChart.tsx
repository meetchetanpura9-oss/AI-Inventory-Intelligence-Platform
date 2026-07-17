"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPanel } from "./ChartPanel";
import type { InventoryHealthPoint } from "../types/dashboard";

interface InventoryChartProps {
  data: InventoryHealthPoint[];
}

export function InventoryChart({ data }: InventoryChartProps) {
  return (
    <ChartPanel title="Inventory Health" description="Healthy, watch, and critical stock mix">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={4}
            isAnimationActive
            animationBegin={100}
            animationDuration={950}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#102235", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }}
            labelStyle={{ color: "#f8fafc" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
