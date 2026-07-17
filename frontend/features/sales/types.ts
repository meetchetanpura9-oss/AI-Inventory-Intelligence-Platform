export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
export type OrderStatus = "Completed" | "Processing" | "Packed" | "Shipped" | "Cancelled";
export type DateRangeFilter = "Today" | "7 Days" | "30 Days" | "Custom";
export type ExportFormat = "csv" | "excel";

export interface SaleResponse {
  id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  customer_name: string;
  created_at: string;
  product?: {
    id?: number;
    product_name: string;
    sku: string;
  } | null;
  invoice_number?: string | null;
  discount?: number | null;
  tax?: number | null;
  payment_status?: PaymentStatus | null;
  order_status?: OrderStatus | null;
  operator?: string | null;
  remarks?: string | null;
}

export interface SaleCreate {
  product_id: number;
  quantity: number;
  selling_price: number;
  customer_name: string;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer: string;
  product: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  subtotal: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  operator: string;
  remarks: string;
}

export type SaleDetails = Sale;

export interface SaleSummary {
  todays_revenue: number;
  orders_today: number;
  average_order_value: number;
  completed_orders: number;
}

export interface SalesFilters {
  search?: string;
  orderStatus?: "All" | OrderStatus;
  paymentStatus?: "All" | PaymentStatus;
  dateRange?: DateRangeFilter;
  customFrom?: string;
  customTo?: string;
  page?: number;
  limit?: number;
}

export interface SalesQueryResult {
  items: Sale[];
  exportRows: Sale[];
  total: number;
  summary: SaleSummary;
}
