import { useQuery } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";

export function usePurchase(id?: number | null) {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => purchaseService.getPurchase(Number(id)),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export default usePurchase;
