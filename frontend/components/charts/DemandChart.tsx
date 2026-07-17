"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export function DemandChart() {
  const option = {
    backgroundColor: "transparent",
    textStyle: {
      color: "#94a3b8",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#102235",
      borderColor: "#223046",
      textStyle: {
        color: "#ffffff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      axisLine: {
        lineStyle: {
          color: "#223046",
        },
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#223046",
        },
      },
    },
    series: [
      {
        name: "Actual Demand",
        type: "bar",
        data: [150, 180, 224, 218, 135, 147],
        itemStyle: {
          color: "#3b82f6",
        },
      },
      {
        name: "Expected Demand",
        type: "line",
        data: [160, 170, 200, 210, 150, 160],
        itemStyle: {
          color: "#f59e0b",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} lazyUpdate />;
}
export default DemandChart;
