"use client";

import { useState, useEffect } from "react";
import { getDemandData } from "@/services/demand";
import type { DemandRecord, ForecastData } from "@/types/analytics";

export function useAnalytics() {
  const [demandData, setDemandData] = useState<DemandRecord[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const demand = await getDemandData();
        setDemandData(demand);
        setForecastData([]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load analytics"));
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return {
    demandData,
    forecastData,
    isLoading,
    error,
  };
}
export default useAnalytics;
