import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { getInventory } from "@/services/inventory";
import { useMemo } from "react";

export function useProducts(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const offset = (page - 1) * limit;

  // Query 1: Fetch products based on search & filter
  const productsQuery = useQuery({
    queryKey: ["products", params?.search, params?.category, params?.sortBy, params?.sortOrder],
    queryFn: () =>
      productService.getProducts({
        search: params?.search || undefined,
        category: params?.category || undefined,
        limit: 1000,
        offset: 0,
        sort_by: params?.sortBy || undefined,
        sort_order: params?.sortOrder || undefined,
      }),
  });

  // Query 2: Fetch inventory to map real stock quantities
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  });

  // Combine products and inventory
  const combined = useMemo(() => {
    const products = productsQuery.data || [];
    const inventory = inventoryQuery.data || [];

    const mapped = products.map((prod) => {
      const invItem = inventory.find((inv) => inv.sku === prod.sku);
      const stock = invItem?.current_stock ?? 0;
      const minStock = invItem?.minimum_stock ?? 5;

      let status: "Safe" | "Warning" | "Critical" = "Safe";
      if (stock === 0) status = "Critical";
      else if (stock <= minStock) status = "Warning";

      return {
        ...prod,
        stock,
        status,
      };
    });

    // Frontend Pagination and slicing
    const total = mapped.length;
    const paginated = mapped.slice(offset, offset + limit);

    return {
      products: paginated,
      total,
    };
  }, [productsQuery.data, inventoryQuery.data, offset, limit]);

  return {
    products: combined?.products ?? [],
    total: combined?.total ?? 0,
    isLoading: productsQuery.isLoading || inventoryQuery.isLoading,
    isError: productsQuery.isError || inventoryQuery.isError,
    refetch: () => {
      productsQuery.refetch();
      inventoryQuery.refetch();
    },
  };
}
export default useProducts;
