export type AnalyticsDateRange = "Today" | "Last 7 Days" | "Last 30 Days" | "Last Quarter" | "Custom";
export type ExportFormat = "csv" | "excel" | "pdf";

export interface AnalyticsSummary {
  total_revenue: number;
  todays_sales: number;
  todays_purchases: number;
  inventory_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  warehouse_health: number;
  ai_confidence: number;
  profit: number;
}

export interface RevenueTrend {
  label: string;
  revenue: number;
  purchases: number;
  profit: number;
}

export interface SalesTrend {
  label: string;
  sales: number;
  orders: number;
}

export interface PurchaseTrend {
  label: string;
  purchases: number;
  orders: number;
}

export interface CategorySales {
  category: string;
  value: number;
}

export interface InventoryHealth {
  warehouse: string;
  inventory_value: number;
  stock_health: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  sales: number;
  revenue: number;
  trend: "Up" | "Stable" | "Down";
}

export interface LowStockProduct {
  product_id: number;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
  status: "Low Stock" | "Critical";
}

export interface DashboardActivity {
  id: string;
  time: string;
  title: string;
  detail: string;
}

export interface BusinessInsights {
  highest_revenue_product: string;
  highest_profit_category: string;
  fastest_moving_product: string;
  slow_moving_product: string;
  most_active_warehouse: string;
}

export interface AnalyticsFilters {
  dateRange: AnalyticsDateRange;
  warehouse: string;
  category: string;
  customFrom?: string;
  customTo?: string;
}

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  revenueTrend: RevenueTrend[];
  salesTrend: SalesTrend[];
  purchaseTrend: PurchaseTrend[];
  categorySales: CategorySales[];
  inventoryHealth: InventoryHealth[];
  topProducts: TopProduct[];
  lowStock: LowStockProduct[];
  recentActivities: DashboardActivity[];
  insights: BusinessInsights;
}
