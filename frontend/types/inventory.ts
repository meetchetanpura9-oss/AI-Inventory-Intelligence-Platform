export interface InventoryCreate {
  product_id: number;
  quantity?: number;
  minimum_stock?: number;
  maximum_stock?: number;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  created_at: string;
  updated_at: string;
}

export interface StockMutationRequest {
  quantity: number;
  reference?: string | null;
  remarks?: string | null;
}

export interface LowStockItem {
  product: string;
  quantity: number;
}

export interface OutOfStockItem {
  product: string;
}

export interface InventoryDashboard {
  total_products: number;
  total_stock: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

export interface InventoryTransaction {
  id: number;
  product_id: number;
  transaction_type: string;
  quantity: number;
  reference?: string | null;
  remarks?: string | null;
  created_at: string;
  product_name?: string;
  sku?: string;
}

export interface InventoryItem {
  id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  reorder_level: number;
  warehouse_name?: string | null;
  minimum_stock: number;
  maximum_stock: number;
}
