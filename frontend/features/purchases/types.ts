export type PurchaseStatus = "Pending" | "Processing" | "Ordered" | "Received" | "Cancelled";
export type PurchasePaymentStatus = "Paid" | "Pending" | "Partially Paid";
export type DateRangeFilter = "Today" | "Last 7 Days" | "Last 30 Days" | "Custom";
export type ExportFormat = "csv" | "excel";

export interface PurchaseResponse {
  id: number;
  product_id: number;
  quantity: number;
  cost_price: number;
  supplier_name: string;
  created_at: string;
  product?: {
    id?: number;
    product_name: string;
    sku: string;
  } | null;
  po_number?: string | null;
  supplier_contact?: string | null;
  warehouse?: string | null;
  tax?: number | null;
  shipping_cost?: number | null;
  discount?: number | null;
  payment_status?: PurchasePaymentStatus | null;
  purchase_status?: PurchaseStatus | null;
  received_date?: string | null;
  operator?: string | null;
  remarks?: string | null;
}

export interface PurchaseCreate {
  product_id: number;
  quantity: number;
  cost_price: number;
  supplier_name: string;
}

export interface Purchase {
  id: number;
  po_number: string;
  supplier: string;
  supplier_contact: string;
  product: string;
  sku: string;
  quantity: number;
  unit_cost: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  subtotal: number;
  grand_total: number;
  warehouse: string;
  payment_status: PurchasePaymentStatus;
  purchase_status: PurchaseStatus;
  received_date: string | null;
  created_at: string;
  operator: string;
  remarks: string;
}

export type PurchaseDetails = Purchase;

export interface PurchaseSummary {
  todays_purchases: number;
  todays_spend: number;
  pending_deliveries: number;
  suppliers: number;
}

export interface PurchaseFilters {
  search?: string;
  purchaseStatus?: "All" | PurchaseStatus;
  paymentStatus?: "All" | PurchasePaymentStatus;
  warehouse?: string;
  dateRange?: DateRangeFilter;
  customFrom?: string;
  customTo?: string;
  page?: number;
  limit?: number;
}

export interface PurchaseQueryResult {
  items: Purchase[];
  exportRows: Purchase[];
  total: number;
  summary: PurchaseSummary;
}
