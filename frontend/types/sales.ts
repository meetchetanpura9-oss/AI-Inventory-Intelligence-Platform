export interface SaleCreate {
  product_id: number;
  quantity: number;
  selling_price: number;
  customer_name: string;
}

export interface Sale extends SaleCreate {
  id: number;
  created_at: string;
  product_name?: string;
  sku?: string;
}
