import type { Product } from "./product";

export interface DashboardSummary {
  total_products: number;
  total_stock: number;
  inventory_value: number;
  sales_today: number;
  purchase_today: number;
  profit: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

export interface SalesAnalytics {
  product_id: number;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
}

export interface PurchaseAnalytics {
  product_id: number;
  product_name: string;
  purchased_quantity: number;
  total_spend: number;
}

export interface InventoryAnalytics {
  product_id: number;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  inventory_value: number;
}

export interface TransactionAnalytics {
  transaction_type: string;
  transaction_count: number;
  total_quantity_moved: number;
}

export interface TopSellingProduct {
  product_id: number;
  product_name: string;
  quantity_sold: number;
  total_revenue: number;
}

export interface TopDemandProduct {
  product_id: number;
  product_name: string;
  demand_score: number;
  demand_level: string;
}

export interface AnalyticsLowStockItem {
  product_id: number;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
}

export interface ProfitReport {
  today_profit: number;
  total_profit: number;
}

export interface DemandData {
  product_id: number;
  product_name: string;
  actual_demand: number;
  expected_demand: number;
  week: string;
}

export interface ForecastData {
  product_id: number;
  product_name: string;
  predicted_demand: number;
  suggested_reorder_qty: number;
  stockout_risk: number;
  forecast_period_days: number;
}

export interface DemandRecord {
  id: number;
  product_id: number;
  demand_score: number;
  demand_level: "HIGH" | "MEDIUM" | "LOW" | string;
  purchase_count: number;
  search_count: number;
  failed_searches: number;
  city?: string;
  area?: string;
  current_stock?: number;
  product?: Product;
}
