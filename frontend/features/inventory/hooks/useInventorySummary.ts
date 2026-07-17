import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";

export function useInventorySummary() {
  return useQuery({
    queryKey: ["inventory-summary"],
    queryFn: inventoryService.getInventorySummary,
  });
}

export default useInventorySummary;
