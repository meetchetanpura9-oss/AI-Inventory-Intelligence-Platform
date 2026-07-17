import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demandService } from "../services/demandService";

export interface DemandFilters {
  city?: string;
  area?: string;
  category?: string;
  demandLevel?: string;
  recommendation?: string;
  search?: string;
}

export function useDemand(filters?: DemandFilters) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["demandProducts", filters],
    queryFn: () => demandService.getDemandProducts(filters),
  });

  const refreshMutation = useMutation({
    mutationFn: () => demandService.refreshDemand(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandProducts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const data = productsQuery.data || [];
  
  // Dynamically calculate metrics based on currently loaded dataset
  const summary = demandService.getDemandSummary(data);
  const predictions = demandService.getDemandPredictions(data);
  const recommendations = demandService.getRecommendations(data);

  return {
    products: data,
    summary,
    predictions,
    recommendations,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
    refresh: () => demandService.refreshDemand(),
  };
}
