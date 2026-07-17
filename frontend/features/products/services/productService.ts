import { api } from "@/services/api";
import { API } from "@/constants/api";
import type { Product, CreateProduct, UpdateProduct } from "../types";

const normalizeProduct = (product: Product): Product => ({
  ...product,
  name: product.product_name,
  price: product.selling_price,
});

const toProductApiPayload = (payload: CreateProduct | UpdateProduct) => {
  const { name, price, description, ...apiPayload } = payload;
  void name;
  void price;
  void description;
  return apiPayload;
};

export const productService = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  }): Promise<Product[]> {
    const response = await api.get<Product[]>(API.PRODUCTS, { params });
    return Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`${API.PRODUCTS}/${id}`);
    return normalizeProduct(response.data);
  },

  async createProduct(payload: CreateProduct): Promise<Product> {
    const response = await api.post<Product>(API.PRODUCTS, toProductApiPayload(payload));
    return normalizeProduct(response.data);
  },

  async updateProduct(id: number, payload: UpdateProduct): Promise<Product> {
    const response = await api.put<Product>(`${API.PRODUCTS}/${id}`, toProductApiPayload(payload));
    return normalizeProduct(response.data);
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`${API.PRODUCTS}/${id}`);
  },

  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts({ search: query });
  },

  async filterProducts(category: string): Promise<Product[]> {
    return this.getProducts({ category });
  }
};
