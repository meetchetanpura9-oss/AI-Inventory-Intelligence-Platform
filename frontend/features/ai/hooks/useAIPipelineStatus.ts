import { useQuery } from "@tanstack/react-query";
import { aiDatasetService } from "../services/aiDatasetService";

export function useAIPipelineStatus() {
  return useQuery({
    queryKey: ["ai-pipeline-status"],
    queryFn: () => aiDatasetService.getPipelineStatus(),
    refetchInterval: 10_000, // Poll pipeline status every 10 seconds.
  });
}

export default useAIPipelineStatus;
