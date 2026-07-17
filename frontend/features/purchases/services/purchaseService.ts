import { api } from "@/services/api";
import { API } from "@/constants/api";
import type {
  DateRangeFilter,
  ExportFormat,
  Purchase,
  PurchaseCreate,
  PurchaseDetails,
  PurchaseFilters,
  PurchasePaymentStatus,
  PurchaseQueryResult,
  PurchaseResponse,
  PurchaseStatus,
  PurchaseSummary,
} from "../types";

const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"];
const purchaseStatuses: PurchaseStatus[] = ["Received", "Ordered", "Processing", "Pending", "Cancelled"];
const paymentStatuses: PurchasePaymentStatus[] = ["Paid", "Pending", "Partially Paid"];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const isSameDay = (date: Date, compareTo: Date) =>
  date.getFullYear() === compareTo.getFullYear() &&
  date.getMonth() === compareTo.getMonth() &&
  date.getDate() === compareTo.getDate();

const getDeterministicStatus = <T,>(items: T[], id: number) => items[id % items.length];

const mapResponseToPurchase = (item: PurchaseResponse): Purchase => {
  const subtotal = item.quantity * item.cost_price;
  const discount = item.discount ?? 0;
  const tax = item.tax ?? Math.round(Math.max(0, subtotal - discount) * 0.12);
  const shippingCost = item.shipping_cost ?? (item.id % 4 === 0 ? 0 : 250 + (item.id % 5) * 75);
  const status = item.purchase_status || getDeterministicStatus(purchaseStatuses, item.id);

  return {
    id: item.id,
    po_number: item.po_number || `PO-${String(item.id).padStart(5, "0")}`,
    supplier: item.supplier_name,
    supplier_contact: item.supplier_contact || `supplier${item.id}@example.com`,
    product: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    quantity: item.quantity,
    unit_cost: item.cost_price,
    tax,
    shipping_cost: shippingCost,
    discount,
    subtotal,
    grand_total: Math.max(0, subtotal - discount + tax + shippingCost),
    warehouse: item.warehouse || warehouses[item.id % warehouses.length],
    payment_status: item.payment_status || getDeterministicStatus(paymentStatuses, item.id),
    purchase_status: status,
    received_date: item.received_date || (status === "Received" ? item.created_at : null),
    created_at: item.created_at,
    operator: item.operator || "Procurement Admin",
    remarks: item.remarks || "-",
  };
};

const matchesDateRange = (
  purchase: Purchase,
  range: DateRangeFilter = "Last 30 Days",
  customFrom?: string,
  customTo?: string
) => {
  const createdAt = new Date(purchase.created_at);
  const now = new Date();

  if (range === "Today") {
    return isSameDay(createdAt, now);
  }

  if (range === "Last 7 Days" || range === "Last 30 Days") {
    const days = range === "Last 7 Days" ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - days);
    return createdAt >= start && createdAt <= now;
  }

  const from = customFrom ? new Date(`${customFrom}T00:00:00`) : null;
  const to = customTo ? new Date(`${customTo}T23:59:59`) : null;
  return (!from || createdAt >= from) && (!to || createdAt <= to);
};

const buildSummary = (purchases: Purchase[]): PurchaseSummary => {
  const today = new Date();
  const todaysPurchases = purchases.filter((purchase) => isSameDay(new Date(purchase.created_at), today));
  const uniqueSuppliers = new Set(purchases.map((purchase) => purchase.supplier.toLowerCase()));

  return {
    todays_purchases: todaysPurchases.length,
    todays_spend: todaysPurchases.reduce((sum, purchase) => sum + purchase.grand_total, 0),
    pending_deliveries: purchases.filter((purchase) =>
      ["Pending", "Processing", "Ordered"].includes(purchase.purchase_status)
    ).length,
    suppliers: uniqueSuppliers.size,
  };
};

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const toCsvCell = (value: string | number | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const purchaseService = {
  async getPurchases(): Promise<Purchase[]> {
    const response = await api.get<PurchaseResponse[]>(API.PURCHASES, {
      params: { limit: 500, offset: 0 },
    });

    return Array.isArray(response.data) ? response.data.map(mapResponseToPurchase) : [];
  },

  async getPurchase(id: number): Promise<PurchaseDetails> {
    const response = await api.get<PurchaseResponse>(`${API.PURCHASES}/${id}`);
    return mapResponseToPurchase(response.data);
  },

  async createPurchase(payload: PurchaseCreate): Promise<Purchase> {
    const response = await api.post<PurchaseResponse>(API.PURCHASES, payload);
    return mapResponseToPurchase(response.data);
  },

  async updatePurchase(id: number, payload: Partial<PurchaseCreate>): Promise<Purchase> {
    const response = await api.put<PurchaseResponse>(`${API.PURCHASES}/${id}`, payload);
    return mapResponseToPurchase(response.data);
  },

  searchPurchases(purchases: Purchase[], query = ""): Purchase[] {
    if (!query.trim()) return purchases;
    const lowerQuery = query.toLowerCase();

    return purchases.filter(
      (purchase) =>
        purchase.supplier.toLowerCase().includes(lowerQuery) ||
        purchase.po_number.toLowerCase().includes(lowerQuery) ||
        purchase.product.toLowerCase().includes(lowerQuery)
    );
  },

  filterPurchases(purchases: Purchase[], filters: PurchaseFilters): Purchase[] {
    return purchases.filter((purchase) => {
      const matchesPurchaseStatus =
        !filters.purchaseStatus ||
        filters.purchaseStatus === "All" ||
        purchase.purchase_status === filters.purchaseStatus;
      const matchesPaymentStatus =
        !filters.paymentStatus ||
        filters.paymentStatus === "All" ||
        purchase.payment_status === filters.paymentStatus;
      const matchesWarehouse =
        !filters.warehouse ||
        filters.warehouse === "All Warehouses" ||
        purchase.warehouse === filters.warehouse;

      return (
        matchesPurchaseStatus &&
        matchesPaymentStatus &&
        matchesWarehouse &&
        matchesDateRange(purchase, filters.dateRange, filters.customFrom, filters.customTo)
      );
    });
  },

  async getPurchaseQuery(filters: PurchaseFilters = {}): Promise<PurchaseQueryResult> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;
    const purchases = await this.getPurchases();
    const searched = this.searchPurchases(purchases, filters.search);
    const filtered = this.filterPurchases(searched, filters);

    return {
      items: filtered.slice(offset, offset + limit),
      exportRows: filtered,
      total: filtered.length,
      summary: buildSummary(filtered),
    };
  },

  exportPurchases(purchases: Purchase[], format: ExportFormat) {
    const headers = [
      "PO Number",
      "Supplier",
      "Supplier Contact",
      "Product",
      "Warehouse",
      "Quantity",
      "Unit Cost",
      "Discount",
      "Tax",
      "Shipping",
      "Grand Total",
      "Payment Status",
      "Purchase Status",
      "Received Date",
      "Created Date",
      "Operator",
      "Remarks",
    ];

    const rows = purchases.map((purchase) => [
      purchase.po_number,
      purchase.supplier,
      purchase.supplier_contact,
      purchase.product,
      purchase.warehouse,
      purchase.quantity,
      purchase.unit_cost,
      purchase.discount,
      purchase.tax,
      purchase.shipping_cost,
      purchase.grand_total,
      purchase.payment_status,
      purchase.purchase_status,
      purchase.received_date ? new Date(purchase.received_date).toLocaleString() : "",
      new Date(purchase.created_at).toLocaleString(),
      purchase.operator,
      purchase.remarks,
    ]);

    if (format === "excel") {
      const tableRows = [headers, ...rows]
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${String(cell).replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</td>`).join("")}</tr>`
        )
        .join("");

      downloadFile("purchase-report.xls", `<table>${tableRows}</table>`, "application/vnd.ms-excel;charset=utf-8");
      return;
    }

    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
    downloadFile("purchase-report.csv", csv, "text/csv;charset=utf-8");
  },
};

export default purchaseService;
