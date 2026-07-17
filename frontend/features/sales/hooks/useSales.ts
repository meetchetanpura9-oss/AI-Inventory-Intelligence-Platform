import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/salesService";
import type { SalesFilters } from "../types";

export function useSales(filters: SalesFilters = {}) {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: () => salesService.getSalesQuery(filters),
    staleTime: 30_000,
  });
}

export default useSales;
