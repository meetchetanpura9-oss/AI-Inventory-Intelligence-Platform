import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import type { AddStockRequest } from "../types";

export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: number;
      payload: AddStockRequest;
    }) => inventoryService.addStock(productId, payload),
    onSuccess: () => {
      // Invalidate relevant query keys to trigger automatic refetches
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-history"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Dashboard stats if any
    },
  });
}

export default useAddStock;
