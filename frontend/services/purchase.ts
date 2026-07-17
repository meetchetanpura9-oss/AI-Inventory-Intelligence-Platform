import { api } from "./api";
import { API } from "@/constants/api";
import type { Purchase, PurchaseCreate } from "@/types/purchase";

interface RawPurchaseResponse {
  id: number;
  product_id: number;
  quantity: number;
  cost_price: number;
  supplier_name: string;
  created_at: string;
  product?: {
    product_name: string;
    sku: string;
  } | null;
}

export async function getPurchases(params?: { limit?: number; offset?: number }): Promise<Purchase[]> {
  const response = await api.get<RawPurchaseResponse[]>(API.PURCHASES, { params });
  return response.data.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    quantity: item.quantity,
    cost_price: item.cost_price,
    supplier_name: item.supplier_name,
    created_at: item.created_at,
  }));
}

export async function createPurchase(payload: PurchaseCreate): Promise<Purchase> {
  const response = await api.post<Purchase>(API.PURCHASES, payload);
  return response.data;
}
