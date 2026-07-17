import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { useMemo } from "react";

interface UseInventoryParams {
  search?: string;
  warehouse?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useInventory(params?: UseInventoryParams) {
  const search = params?.search || "";
  const warehouse = params?.warehouse || "All";
  const status = params?.status || "All";
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const offset = (page - 1) * limit;

  // Fetch all inventory list from backend API
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getInventory,
  });

  const processed = useMemo(() => {
    const rawData = inventoryQuery.data || [];

    // 1. Search filter
    let filtered = inventoryService.searchInventory(rawData, search);

    // 2. Warehouse & Status filter
    filtered = inventoryService.filterInventory(filtered, warehouse, status);

    const total = filtered.length;

    // 3. Slice for client-side pagination
    const paginated = filtered.slice(offset, offset + limit);

    return {
      items: paginated,
      total,
    };
  }, [inventoryQuery.data, search, warehouse, status, offset, limit]);

  return {
    data: processed.items,
    total: processed.total,
    isLoading: inventoryQuery.isLoading,
    isError: inventoryQuery.isError,
    refetch: inventoryQuery.refetch,
  };
}

export default useInventory;
