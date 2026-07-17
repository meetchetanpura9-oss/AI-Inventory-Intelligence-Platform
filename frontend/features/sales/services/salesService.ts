import { api } from "@/services/api";
import { API } from "@/constants/api";
import type {
  DateRangeFilter,
  ExportFormat,
  OrderStatus,
  PaymentStatus,
  Sale,
  SaleCreate,
  SaleDetails,
  SaleResponse,
  SalesFilters,
  SalesQueryResult,
  SaleSummary,
} from "../types";

const paymentStatuses: PaymentStatus[] = ["Paid", "Pending", "Failed", "Refunded"];
const orderStatuses: OrderStatus[] = ["Completed", "Processing", "Packed", "Shipped", "Cancelled"];

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

const mapResponseToSale = (item: SaleResponse): Sale => {
  const subtotal = item.quantity * item.selling_price;
  const discount = item.discount ?? 0;
  const tax = item.tax ?? Math.round(Math.max(0, subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount + tax);

  return {
    id: item.id,
    invoice_number: item.invoice_number || `INV-${String(item.id).padStart(5, "0")}`,
    customer: item.customer_name,
    product: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    quantity: item.quantity,
    unit_price: item.selling_price,
    discount,
    tax,
    subtotal,
    total,
    payment_status: item.payment_status || getDeterministicStatus(paymentStatuses, item.id),
    order_status: item.order_status || getDeterministicStatus(orderStatuses, item.id),
    created_at: item.created_at,
    operator: item.operator || "System Staff",
    remarks: item.remarks || "-",
  };
};

const matchesDateRange = (
  sale: Sale,
  range: DateRangeFilter = "30 Days",
  customFrom?: string,
  customTo?: string
) => {
  const createdAt = new Date(sale.created_at);
  const now = new Date();

  if (range === "Today") {
    return isSameDay(createdAt, now);
  }

  if (range === "7 Days" || range === "30 Days") {
    const days = range === "7 Days" ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - days);
    return createdAt >= start && createdAt <= now;
  }

  const from = customFrom ? new Date(`${customFrom}T00:00:00`) : null;
  const to = customTo ? new Date(`${customTo}T23:59:59`) : null;
  return (!from || createdAt >= from) && (!to || createdAt <= to);
};

const buildSummary = (sales: Sale[]): SaleSummary => {
  const today = new Date();
  const todaysSales = sales.filter((sale) => isSameDay(new Date(sale.created_at), today));
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return {
    todays_revenue: todaysSales.reduce((sum, sale) => sum + sale.total, 0),
    orders_today: todaysSales.length,
    average_order_value: sales.length ? totalRevenue / sales.length : 0,
    completed_orders: sales.filter((sale) => sale.order_status === "Completed").length,
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

const toCsvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export const salesService = {
  async getSales(): Promise<Sale[]> {
    const response = await api.get<SaleResponse[]>(API.SALES, {
      params: { limit: 500, offset: 0 },
    });

    return Array.isArray(response.data) ? response.data.map(mapResponseToSale) : [];
  },

  async getSale(id: number): Promise<SaleDetails> {
    const response = await api.get<SaleResponse>(`${API.SALES}/${id}`);
    return mapResponseToSale(response.data);
  },

  async createSale(payload: SaleCreate): Promise<Sale> {
    const response = await api.post<SaleResponse>(API.SALES, payload);
    return mapResponseToSale(response.data);
  },

  searchSales(sales: Sale[], query = ""): Sale[] {
    if (!query.trim()) return sales;
    const lowerQuery = query.toLowerCase();

    return sales.filter(
      (sale) =>
        sale.invoice_number.toLowerCase().includes(lowerQuery) ||
        sale.customer.toLowerCase().includes(lowerQuery) ||
        sale.product.toLowerCase().includes(lowerQuery)
    );
  },

  filterSales(sales: Sale[], filters: SalesFilters): Sale[] {
    return sales.filter((sale) => {
      const matchesOrder =
        !filters.orderStatus || filters.orderStatus === "All" || sale.order_status === filters.orderStatus;
      const matchesPayment =
        !filters.paymentStatus ||
        filters.paymentStatus === "All" ||
        sale.payment_status === filters.paymentStatus;

      return (
        matchesOrder &&
        matchesPayment &&
        matchesDateRange(sale, filters.dateRange, filters.customFrom, filters.customTo)
      );
    });
  },

  async getSalesQuery(filters: SalesFilters = {}): Promise<SalesQueryResult> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;
    const sales = await this.getSales();
    const searched = this.searchSales(sales, filters.search);
    const filtered = this.filterSales(searched, filters);

    return {
      items: filtered.slice(offset, offset + limit),
      exportRows: filtered,
      total: filtered.length,
      summary: buildSummary(filtered),
    };
  },

  exportSales(sales: Sale[], format: ExportFormat) {
    const headers = [
      "Invoice",
      "Customer",
      "Product",
      "Quantity",
      "Unit Price",
      "Discount",
      "Tax",
      "Subtotal",
      "Total",
      "Payment Status",
      "Order Status",
      "Operator",
      "Date",
      "Remarks",
    ];

    const rows = sales.map((sale) => [
      sale.invoice_number,
      sale.customer,
      sale.product,
      sale.quantity,
      sale.unit_price,
      sale.discount,
      sale.tax,
      sale.subtotal,
      sale.total,
      sale.payment_status,
      sale.order_status,
      sale.operator,
      new Date(sale.created_at).toLocaleString(),
      sale.remarks,
    ]);

    if (format === "excel") {
      const tableRows = [headers, ...rows]
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${String(cell).replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</td>`).join("")}</tr>`
        )
        .join("");

      downloadFile("sales-report.xls", `<table>${tableRows}</table>`, "application/vnd.ms-excel;charset=utf-8");
      return;
    }

    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
    downloadFile("sales-report.csv", csv, "text/csv;charset=utf-8");
  },
};

export default salesService;
