import { api } from "./api";
import { API } from "@/constants/api";
import type { InventoryItem, StockMutationRequest, InventoryTransaction, Inventory } from "@/types/inventory";

interface RawInventoryResponse {
  id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  created_at: string;
  updated_at: string;
  product?: {
    product_name: string;
    sku: string;
  } | null;
}

interface RawTransactionResponse {
  id: number;
  product_id: number;
  transaction_type: string;
  quantity: number;
  reference?: string | null;
  remarks?: string | null;
  created_at: string;
  product?: {
    product_name: string;
    sku: string;
  } | null;
}

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await api.get<RawInventoryResponse[]>(API.INVENTORY);
  // Map backend response (which includes product relation) to InventoryItem expected by frontend
  return response.data.map((item) => ({
    id: item.id,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    current_stock: item.quantity,
    reorder_level: item.minimum_stock,
    minimum_stock: item.minimum_stock,
    maximum_stock: item.maximum_stock,
    warehouse_name: "Austin Main Warehouse", // Default warehouse name as location is not in backend model
  }));
}

export async function getInventoryByProduct(productId: number): Promise<Inventory> {
  const response = await api.get<Inventory>(`${API.INVENTORY}/${productId}`);
  return response.data;
}

export async function addStock(productId: number, payload: StockMutationRequest): Promise<InventoryTransaction> {
  const response = await api.post<InventoryTransaction>(`${API.INVENTORY}/add-stock/${productId}`, payload);
  return response.data;
}

export async function removeStock(productId: number, payload: StockMutationRequest): Promise<InventoryTransaction> {
  const response = await api.post<InventoryTransaction>(`${API.INVENTORY}/remove-stock/${productId}`, payload);
  return response.data;
}

export async function getTransactionHistory(params?: { limit?: number; offset?: number }): Promise<InventoryTransaction[]> {
  const response = await api.get<RawTransactionResponse[]>(`${API.INVENTORY}/transactions`, { params });
  return response.data.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    transaction_type: item.transaction_type,
    quantity: item.quantity,
    reference: item.reference,
    remarks: item.remarks,
    created_at: item.created_at,
  }));
}
