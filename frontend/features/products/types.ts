export interface Product {
  id: number;
  sku: string;
  name?: string;
  product_name: string;
  brand?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
  subcategory?: string | null;
  unit?: string | null;
  mrp?: number | null;
  selling_price: number | null;
  cost_price: number | null;
  is_active?: boolean;
  stock?: number | null;
  status?: "Safe" | "Warning" | "Critical";
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateProduct {
  sku: string;
  name?: string;
  product_name: string;
  brand?: string;
  category: string;
  price?: number;
  description?: string;
  selling_price: number;
  cost_price: number;
  mrp?: number;
  unit?: string;
}

export interface UpdateProduct {
  sku?: string;
  name?: string;
  product_name?: string;
  brand?: string;
  category?: string;
  price?: number;
  description?: string;
  selling_price?: number;
  cost_price?: number;
  mrp?: number;
  unit?: string;
}

export type ProductResponse = Product;

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
