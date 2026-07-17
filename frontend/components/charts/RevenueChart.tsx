"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export function RevenueChart() {
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
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
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
        name: "Revenue",
        type: "bar",
        barWidth: "40%",
        data: [3200, 4500, 2900, 5600, 7100, 6800, 9200],
        itemStyle: {
          color: "#14b8a6",
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} lazyUpdate />;
}
export default RevenueChart;
