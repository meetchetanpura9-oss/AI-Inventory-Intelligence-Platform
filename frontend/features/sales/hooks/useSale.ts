import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/salesService";

export function useSale(id?: number | null) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: () => salesService.getSale(Number(id)),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export default useSale;
