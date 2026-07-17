import { api } from "./api";
import { API } from "@/constants/api";
import type { Product, ProductCreate, ProductQueryParams } from "@/types/product";

export async function getProducts(params?: ProductQueryParams): Promise<Product[]> {
  const response = await api.get<Product[]>(API.PRODUCTS, { params });
  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<Product>(`${API.PRODUCTS}/${id}`);
  return response.data;
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
  const response = await api.post<Product>(API.PRODUCTS, payload);
  return response.data;
}

export async function updateProduct(id: number, payload: Partial<ProductCreate>): Promise<Product> {
  const response = await api.put<Product>(`${API.PRODUCTS}/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  await api.delete(`${API.PRODUCTS}/${id}`);
  return { success: true };
}
