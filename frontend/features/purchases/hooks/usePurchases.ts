import { useQuery } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";
import type { PurchaseFilters } from "../types";

export function usePurchases(filters: PurchaseFilters = {}) {
  return useQuery({
    queryKey: ["purchases", filters],
    queryFn: () => purchaseService.getPurchaseQuery(filters),
    staleTime: 30_000,
  });
}

export default usePurchases;
