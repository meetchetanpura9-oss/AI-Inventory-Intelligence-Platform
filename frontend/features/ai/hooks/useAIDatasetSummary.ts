import { useQuery } from "@tanstack/react-query";
import { aiDatasetService } from "../services/aiDatasetService";

export function useAIDatasetSummary() {
  return useQuery({
    queryKey: ["ai-dataset-summary"],
    queryFn: () => aiDatasetService.getDatasetSummary(),
    staleTime: 30_000,
  });
}

export default useAIDatasetSummary;
