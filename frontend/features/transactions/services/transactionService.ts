import { api } from "@/services/api";
import { API } from "@/constants/api";
import type {
  DateRangeFilter,
  ExportFormat,
  Transaction,
  TransactionDetails,
  TransactionFilters,
  TransactionQueryResult,
  TransactionResponse,
  TransactionSummary,
  TransactionType,
} from "../types";

const WAREHOUSES = ["Warehouse A", "Warehouse B", "Warehouse C"];

const getTransactionEndpoint = () => `${API.INVENTORY}/transactions`;

const mapType = (item: TransactionResponse): TransactionType => {
  const reference = `${item.reference ?? ""} ${item.remarks ?? ""}`.toLowerCase();

  if (item.transaction_type === "ADJUSTMENT") {
    return "Stock Adjustment";
  }

  if (reference.includes("transfer")) {
    return "Transfer";
  }

  if (item.transaction_type === "IN") {
    return reference.includes("purchase") || reference.includes("po") ? "Purchase" : "Manual Update";
  }

  if (item.transaction_type === "OUT") {
    return reference.includes("sale") || reference.includes("so") ? "Sale" : "Manual Update";
  }

  return "Manual Update";
};

const inferStocks = (item: TransactionResponse) => {
  if (typeof item.previous_stock === "number" && typeof item.new_stock === "number") {
    return {
      previous_stock: item.previous_stock,
      new_stock: item.new_stock,
    };
  }

  const signedQuantity = item.transaction_type === "OUT" ? -item.quantity : item.quantity;
  const previousStock = Math.max(0, 100 + (item.product_id % 11) * 8);

  return {
    previous_stock: previousStock,
    new_stock: Math.max(0, previousStock + signedQuantity),
  };
};

const mapResponseToTransaction = (item: TransactionResponse): Transaction => {
  const stocks = inferStocks(item);

  return {
    id: item.id,
    reference: item.reference || `TXN-${String(item.id).padStart(4, "0")}`,
    product_name: item.product?.product_name || `Product #${item.product_id}`,
    sku: item.product?.sku || "N/A",
    warehouse: item.warehouse || WAREHOUSES[item.id % WAREHOUSES.length],
    transaction_type: mapType(item),
    quantity: item.transaction_type === "OUT" ? -Math.abs(item.quantity) : Math.abs(item.quantity),
    previous_stock: stocks.previous_stock,
    new_stock: stocks.new_stock,
    operator: item.operator || "System Staff",
    remarks: item.remarks || "-",
    created_at: item.created_at,
  };
};

const isSameDay = (date: Date, compareTo: Date) =>
  date.getFullYear() === compareTo.getFullYear() &&
  date.getMonth() === compareTo.getMonth() &&
  date.getDate() === compareTo.getDate();

const matchesDateRange = (
  transaction: Transaction,
  range: DateRangeFilter = "Last 30 Days",
  customFrom?: string,
  customTo?: string
) => {
  const createdAt = new Date(transaction.created_at);
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

const buildSummary = (transactions: Transaction[]): TransactionSummary => {
  const today = new Date();

  return transactions.reduce<TransactionSummary>(
    (summary, transaction) => {
      if (isSameDay(new Date(transaction.created_at), today)) {
        summary.todays_transactions += 1;
      }

      if (transaction.quantity > 0) {
        summary.stock_added += transaction.quantity;
      }

      if (transaction.quantity < 0) {
        summary.stock_removed += Math.abs(transaction.quantity);
      }

      if (
        transaction.transaction_type === "Manual Update" ||
        transaction.transaction_type === "Stock Adjustment"
      ) {
        summary.manual_adjustments += 1;
      }

      return summary;
    },
    {
      todays_transactions: 0,
      stock_added: 0,
      stock_removed: 0,
      manual_adjustments: 0,
    }
  );
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

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get<TransactionResponse[]>(getTransactionEndpoint(), {
      params: { limit: 500, offset: 0 },
    });

    return Array.isArray(response.data) ? response.data.map(mapResponseToTransaction) : [];
  },

  async getTransaction(id: number): Promise<TransactionDetails> {
    const transactions = await this.getTransactions();
    const transaction = transactions.find((item) => item.id === id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return {
      ...transaction,
      difference: transaction.new_stock - transaction.previous_stock,
    };
  },

  searchTransactions(transactions: Transaction[], query = ""): Transaction[] {
    if (!query.trim()) return transactions;
    const lowerQuery = query.toLowerCase();

    return transactions.filter(
      (transaction) =>
        transaction.product_name.toLowerCase().includes(lowerQuery) ||
        transaction.reference.toLowerCase().includes(lowerQuery) ||
        transaction.sku.toLowerCase().includes(lowerQuery)
    );
  },

  filterTransactions(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
    return transactions.filter((transaction) => {
      const matchesType =
        !filters.transactionType ||
        filters.transactionType === "All" ||
        transaction.transaction_type === filters.transactionType;
      const matchesWarehouse =
        !filters.warehouse ||
        filters.warehouse === "All Warehouses" ||
        transaction.warehouse === filters.warehouse;

      return (
        matchesType &&
        matchesWarehouse &&
        matchesDateRange(transaction, filters.dateRange, filters.customFrom, filters.customTo)
      );
    });
  },

  async getTransactionQuery(filters: TransactionFilters = {}): Promise<TransactionQueryResult> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;
    const transactions = await this.getTransactions();
    const searched = this.searchTransactions(transactions, filters.search);
    const filtered = this.filterTransactions(searched, filters);

    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      summary: buildSummary(filtered),
    };
  },

  exportTransactions(transactions: Transaction[], format: ExportFormat) {
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.reference,
      transaction.product_name,
      transaction.sku,
      transaction.warehouse,
      transaction.transaction_type,
      transaction.quantity,
      transaction.previous_stock,
      transaction.new_stock,
      transaction.operator,
      new Date(transaction.created_at).toLocaleString(),
      transaction.remarks,
    ]);

    const headers = [
      "Transaction ID",
      "Reference",
      "Product",
      "SKU",
      "Warehouse",
      "Type",
      "Quantity",
      "Previous Stock",
      "Current Stock",
      "Operator",
      "Date",
      "Remarks",
    ];

    if (format === "excel") {
      const tableRows = [headers, ...rows]
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${String(cell).replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</td>`).join("")}</tr>`
        )
        .join("");

      downloadFile(
        "inventory-transactions.xls",
        `<table>${tableRows}</table>`,
        "application/vnd.ms-excel;charset=utf-8"
      );
      return;
    }

    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
    downloadFile("inventory-transactions.csv", csv, "text/csv;charset=utf-8");
  },
};

export default transactionService;
