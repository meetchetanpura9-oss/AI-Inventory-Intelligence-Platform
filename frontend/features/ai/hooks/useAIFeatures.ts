import { useQuery } from "@tanstack/react-query";
import { aiDatasetService } from "../services/aiDatasetService";

export function useAIFeatures() {
  return useQuery({
    queryKey: ["ai-features"],
    queryFn: () => aiDatasetService.getFeatures(),
    staleTime: 60_000,
  });
}

export default useAIFeatures;
