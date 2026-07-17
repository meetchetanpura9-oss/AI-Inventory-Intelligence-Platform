export type TransactionType =
  | "Purchase"
  | "Sale"
  | "Manual Update"
  | "Stock Adjustment"
  | "Transfer";

export type DateRangeFilter = "Today" | "Last 7 Days" | "Last 30 Days" | "Custom";

export interface TransactionProductInfo {
  id: number;
  product_name: string;
  sku: string;
}

export interface TransactionResponse {
  id: number;
  product_id: number;
  transaction_type: "IN" | "OUT" | "ADJUSTMENT" | string;
  quantity: number;
  reference?: string | null;
  remarks?: string | null;
  created_at: string;
  product?: TransactionProductInfo | null;
  warehouse?: string | null;
  previous_stock?: number | null;
  new_stock?: number | null;
  operator?: string | null;
}

export interface Transaction {
  id: number;
  reference: string;
  product_name: string;
  sku: string;
  warehouse: string;
  transaction_type: TransactionType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  operator: string;
  remarks: string;
  created_at: string;
}

export interface TransactionDetails extends Transaction {
  difference: number;
}

export interface TransactionSummary {
  todays_transactions: number;
  stock_added: number;
  stock_removed: number;
  manual_adjustments: number;
}

export interface TransactionFilters {
  search?: string;
  transactionType?: "All" | TransactionType;
  warehouse?: string;
  dateRange?: DateRangeFilter;
  customFrom?: string;
  customTo?: string;
  page?: number;
  limit?: number;
}

export interface TransactionQueryResult {
  items: Transaction[];
  total: number;
  summary: TransactionSummary;
}

export type ExportFormat = "csv" | "excel";
