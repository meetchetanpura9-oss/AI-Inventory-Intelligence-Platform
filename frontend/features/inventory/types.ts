export interface ProductInfo {
  id: number;
  product_name: string;
  sku: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  updated_at: string;
  unit: string;
}

export interface InventoryResponse {
  id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  created_at: string;
  updated_at: string;
  product: ProductInfo | null;
}

export interface InventorySummary {
  total_products: number;
  total_stock: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

export interface AddStockRequest {
  quantity: number;
  reference?: string;
  remarks?: string;
}

export interface RemoveStockRequest {
  quantity: number;
  reference?: string;
  remarks?: string;
}

export interface InventoryHistory {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  transaction_type: "IN" | "OUT" | "ADJUSTMENT";
  display_type: "Purchase" | "Sale" | "Adjustment" | "Manual Update";
  quantity: number;
  reference?: string;
  remarks?: string;
  created_at: string;
  user: string;
}
