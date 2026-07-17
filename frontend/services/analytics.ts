import { api } from "./api";
import type {
  DashboardSummary,
  SalesAnalytics,
  PurchaseAnalytics,
  InventoryAnalytics,
  TransactionAnalytics,
  TopSellingProduct,
  TopDemandProduct,
  AnalyticsLowStockItem,
  ProfitReport,
} from "@/types/analytics";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/dashboard");
  return response.data;
}

export async function getSalesAnalytics(): Promise<SalesAnalytics[]> {
  const response = await api.get<SalesAnalytics[]>("/analytics/sales");
  return response.data;
}

export async function getPurchaseAnalytics(): Promise<PurchaseAnalytics[]> {
  const response = await api.get<PurchaseAnalytics[]>("/analytics/purchases");
  return response.data;
}

export async function getInventoryAnalytics(): Promise<InventoryAnalytics[]> {
  const response = await api.get<InventoryAnalytics[]>("/analytics/inventory");
  return response.data;
}

export async function getTransactionAnalytics(): Promise<TransactionAnalytics[]> {
  const response = await api.get<TransactionAnalytics[]>("/analytics/transactions");
  return response.data;
}

export async function getTopSellingProducts(): Promise<TopSellingProduct[]> {
  const response = await api.get<TopSellingProduct[]>("/analytics/top-selling");
  return response.data;
}

export async function getTopDemandProducts(): Promise<TopDemandProduct[]> {
  const response = await api.get<TopDemandProduct[]>("/analytics/top-demand");
  return response.data;
}

export async function getLowStockProducts(): Promise<AnalyticsLowStockItem[]> {
  const response = await api.get<AnalyticsLowStockItem[]>("/analytics/low-stock");
  return response.data;
}

export async function getProfitReport(): Promise<ProfitReport> {
  const response = await api.get<ProfitReport>("/analytics/profit");
  return response.data;
}
