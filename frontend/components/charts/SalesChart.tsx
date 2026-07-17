"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export function SalesChart() {
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
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
        name: "Sales",
        type: "line",
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(59, 130, 246, 0.4)",
              },
              {
                offset: 1,
                color: "rgba(59, 130, 246, 0)",
              },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} lazyUpdate />;
}
export default SalesChart;
