import { api } from "./api";
import { API } from "@/constants/api";
import type { Sale, SaleCreate } from "@/types/sales";

interface RawSaleResponse {
  id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  customer_name: string;
  created_at: string;
  product?: {
    product_name: string;
    sku: string;
  } | null;
}

export async function getSales(params?: { limit?: number; offset?: number }): Promise<Sale[]> {
  const response = await api.get<RawSaleResponse[]>(API.SALES, { params });
  return response.data.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    quantity: item.quantity,
    selling_price: item.selling_price,
    customer_name: item.customer_name,
    created_at: item.created_at,
  }));
}

export async function createSale(payload: SaleCreate): Promise<Sale> {
  const response = await api.post<Sale>(API.SALES, payload);
  return response.data;
}
