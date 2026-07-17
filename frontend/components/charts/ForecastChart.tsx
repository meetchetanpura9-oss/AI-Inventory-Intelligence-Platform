"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export function ForecastChart() {
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
    legend: {
      data: ["Historical Sales", "AI Forecasted Demand"],
      textStyle: {
        color: "#94a3b8",
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
      data: ["Apr", "May", "Jun", "Jul (Hist)", "Aug (Proj)", "Sep (Proj)", "Oct (Proj)"],
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
        name: "Historical Sales",
        type: "line",
        data: [820, 932, 901, 934, null, null, null],
        connectNulls: false,
        itemStyle: {
          color: "#3b82f6",
        },
        lineStyle: {
          width: 3,
        },
      },
      {
        name: "AI Forecasted Demand",
        type: "line",
        data: [null, null, null, 934, 1290, 1330, 1320],
        connectNulls: true,
        itemStyle: {
          color: "#14b8a6",
        },
        lineStyle: {
          type: "dashed",
          width: 3,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} lazyUpdate />;
}
export default ForecastChart;
