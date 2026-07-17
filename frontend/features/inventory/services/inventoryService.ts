import { api } from "@/services/api";
import { API } from "@/constants/api";
import type {
  Inventory,
  InventoryResponse,
  InventorySummary,
  AddStockRequest,
  RemoveStockRequest,
  InventoryHistory,
} from "../types";

const mapResponseToInventory = (item: InventoryResponse): Inventory => {
  const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"];
  const warehouse = warehouses[item.id % warehouses.length];

  let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
  if (item.quantity === 0) {
    status = "Out of Stock";
  } else if (item.quantity <= item.minimum_stock) {
    status = "Low Stock";
  }

  return {
    id: item.id,
    product_id: item.product_id,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    current_stock: item.quantity,
    minimum_stock: item.minimum_stock,
    maximum_stock: item.maximum_stock,
    warehouse,
    status,
    updated_at: item.updated_at,
    unit: "pcs", // Default unit measurement
  };
};

interface RawTransactionResponse {
  id: number;
  product_id: number;
  transaction_type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reference?: string | null;
  remarks?: string | null;
  created_at: string;
  product?: {
    product_name: string;
    sku: string;
  } | null;
}

export const inventoryService = {
  async getInventory(): Promise<Inventory[]> {
    const response = await api.get<InventoryResponse[]>(API.INVENTORY);
    return Array.isArray(response.data) ? response.data.map(mapResponseToInventory) : [];
  },

  async getInventorySummary(): Promise<InventorySummary> {
    const response = await api.get<InventorySummary>(`${API.INVENTORY}/dashboard`);
    return response.data;
  },

  async addStock(productId: number, payload: AddStockRequest): Promise<Inventory> {
    const response = await api.post<InventoryResponse>(
      `${API.INVENTORY}/add-stock/${productId}`,
      payload
    );
    return mapResponseToInventory(response.data);
  },

  async removeStock(productId: number, payload: RemoveStockRequest): Promise<Inventory> {
    const response = await api.post<InventoryResponse>(
      `${API.INVENTORY}/remove-stock/${productId}`,
      payload
    );
    return mapResponseToInventory(response.data);
  },

  async getInventoryHistory(productId?: number): Promise<InventoryHistory[]> {
    const endpoint = productId
      ? `${API.INVENTORY}/transactions/${productId}`
      : `${API.INVENTORY}/transactions`;
    
    const response = await api.get<RawTransactionResponse[]>(endpoint, {
      params: { limit: 100 }
    });

    return Array.isArray(response.data)
      ? response.data.map((item): InventoryHistory => {
          // Map backend transaction_type to user-facing display types
          let mappedType: "Purchase" | "Sale" | "Adjustment" | "Manual Update" = "Manual Update";
          if (item.transaction_type === "ADJUSTMENT") {
            mappedType = "Adjustment";
          } else if (item.transaction_type === "IN") {
            if (item.reference?.toLowerCase().includes("po") || item.reference?.toLowerCase().includes("purchase")) {
              mappedType = "Purchase";
            } else {
              mappedType = "Manual Update";
            }
          } else if (item.transaction_type === "OUT") {
            if (item.reference?.toLowerCase().includes("so") || item.reference?.toLowerCase().includes("sale")) {
              mappedType = "Sale";
            } else {
              mappedType = "Manual Update";
            }
          }

          return {
            id: item.id,
            product_id: item.product_id,
            product_name: item.product?.product_name || `Product #${item.product_id}`,
            sku: item.product?.sku || "N/A",
            transaction_type: item.transaction_type, // Maintain raw IN/OUT/ADJUSTMENT for compatibility
            display_type: mappedType,
            quantity: item.quantity,
            reference: item.reference || "-",
            remarks: item.remarks || "-",
            created_at: item.created_at,
            user: "System Staff", // Mock operator name as user is not returned in API transaction model
          };
        })
      : [];
  },

  searchInventory(items: Inventory[], query: string): Inventory[] {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.product_name.toLowerCase().includes(lowerQuery) ||
        item.sku.toLowerCase().includes(lowerQuery)
    );
  },

  filterInventory(items: Inventory[], warehouse: string, status: string): Inventory[] {
    return items.filter((item) => {
      const matchWarehouse = warehouse === "All" || item.warehouse === warehouse;
      const matchStatus = status === "All" || item.status === status;
      return matchWarehouse && matchStatus;
    });
  },
};
