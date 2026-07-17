import { useQuery } from "@tanstack/react-query";
import { aiDatasetService } from "../services/aiDatasetService";

export function useAIDataset(limit: number, offset: number) {
  return useQuery({
    queryKey: ["ai-dataset", limit, offset],
    queryFn: () => aiDatasetService.getDataset({ limit, offset }),
    staleTime: 30_000,
  });
}

export default useAIDataset;
