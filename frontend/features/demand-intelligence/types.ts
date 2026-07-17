import type { Product } from "@/types/product";

export interface DemandProduct {
  id: string; // UUID from backend
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  sales_count: number;
  search_count: number;
  failed_searches: number;
  purchase_count: number;
  demand_score: number;
  demand_level: "HIGH" | "MEDIUM" | "LOW";
  prediction: string;
  recommendation: "Reorder" | "Monitor" | "Overstock" | "Healthy";
  last_updated: string;
  city?: string | null;
  area?: string | null;
  confidence: number;
  product?: Product | null;
}

export interface DemandSummary {
  highDemandProductsCount: number;
  lowDemandProductsCount: number;
  averageDemandScore: number;
  reorderRequiredCount: number;
  predictedStockoutsCount: number;
  aiConfidence: number;
}

export interface DemandPrediction {
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  predicted_demand: number;
  estimated_stockout_date: string;
  confidence: number;
}

export interface DemandRecommendation {
  id: string;
  product_id: number;
  product_name: string;
  expected_demand_change: string; // e.g. "+18%", "-12%"
  type: "Reorder" | "Monitor" | "Overstock" | "Healthy";
  description: string;
}

export interface DemandTrend {
  date: string;
  demand_score: number;
}

export interface DemandResponse {
  records: DemandProduct[];
  summary: DemandSummary;
  predictions: DemandPrediction[];
  recommendations: DemandRecommendation[];
}
