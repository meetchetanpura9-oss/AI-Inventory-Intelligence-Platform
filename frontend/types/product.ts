export interface ProductCreate {
  sku: string;
  product_name: string;
  brand?: string | null;
  category?: string | null;
  subcategory?: string | null;
  unit?: string | null;
  mrp?: number | null;
  selling_price: number;
  cost_price?: number | null;
}

export interface Product extends ProductCreate {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
