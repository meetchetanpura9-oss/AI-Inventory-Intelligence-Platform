import type { LucideIcon } from "lucide-react";

export type KpiTone = "blue" | "green" | "amber" | "violet" | "rose" | "cyan";

export interface DashboardKpi {
  label: string;
  value: string;
  countTo?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend: string;
  detail: string;
  tone: KpiTone;
  icon: LucideIcon;
}

export interface SalesTrendPoint {
  day: string;
  sales: number;
  orders: number;
}

export interface InventoryHealthPoint {
  name: string;
  value: number;
  fill: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  purchases: number;
}

export interface DemandPoint {
  category: string;
  demand: number;
}

export interface ActivityEvent {
  time: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning" | "ai";
}

export interface LowStockProduct {
  product: string;
  stock: number;
  status: "Critical" | "Warning" | "Safe";
  action: string;
}

export interface TopProduct {
  product: string;
  sold: number;
  trend: string;
  progress: number;
  icon: string;
}

export interface AiInsight {
  title: string;
  recommendation: string;
  reorderQuantity: string;
  confidence: string;
}

export interface DashboardSnapshot {
  lastUpdated: string;
  kpis: DashboardKpi[];
  salesTrend: SalesTrendPoint[];
  inventoryHealth: InventoryHealthPoint[];
  revenue: RevenuePoint[];
  demand: DemandPoint[];
  activities: ActivityEvent[];
  lowStock: LowStockProduct[];
  topProducts: TopProduct[];
  aiInsight: AiInsight;
}
