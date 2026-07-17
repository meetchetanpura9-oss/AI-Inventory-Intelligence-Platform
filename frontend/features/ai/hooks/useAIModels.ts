import { useQuery } from "@tanstack/react-query";
import { aiDatasetService } from "../services/aiDatasetService";

export function useAIModels() {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: () => aiDatasetService.getModels(),
    refetchInterval: 15_000, // Poll every 15 seconds
  });
}

export default useAIModels;
