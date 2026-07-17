"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export function InventoryChart() {
  const option = {
    backgroundColor: "transparent",
    textStyle: {
      color: "#94a3b8",
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#102235",
      borderColor: "#223046",
      textStyle: {
        color: "#ffffff",
      },
    },
    legend: {
      orient: "horizontal",
      bottom: "0",
      textStyle: {
        color: "#94a3b8",
      },
    },
    series: [
      {
        name: "Stock by Category",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#102235",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: "#ffffff",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Electronics", itemStyle: { color: "#3b82f6" } },
          { value: 735, name: "Home & Kitchen", itemStyle: { color: "#14b8a6" } },
          { value: 580, name: "Automotive", itemStyle: { color: "#f59e0b" } },
          { value: 484, name: "Apparel", itemStyle: { color: "#10b981" } },
          { value: 300, name: "Office Supplies", itemStyle: { color: "#ef4444" } },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} lazyUpdate />;
}
export default InventoryChart;
