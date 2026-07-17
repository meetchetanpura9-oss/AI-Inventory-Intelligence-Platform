import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";

export function useInventoryHistory(productId?: number) {
  return useQuery({
    queryKey: ["inventory-history", productId],
    queryFn: () => inventoryService.getInventoryHistory(productId),
  });
}

export default useInventoryHistory;
