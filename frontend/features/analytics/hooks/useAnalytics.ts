import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";
import type { AnalyticsFilters } from "../types";

export function useAnalytics(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["analytics-dashboard", filters],
    queryFn: () => analyticsService.loadDashboard(filters),
    staleTime: 30_000,
  });
}

export default useAnalytics;
