export interface AIDatasetRow {
  date: string;
  product: string;
  sku: string;
  category: string;
  warehouse: string;
  city: string;
  state: string;
  zone: string;
  pincode: string;
  stock: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse_capacity: number;
  stock_percentage: number;
  sales: number;
  today_sales: number;
  yesterday_sales: number;
  last_7_days_sales: number;
  last_30_days_sales: number;
  average_daily_sales: number;
  purchase: number;
  purchase_count: number;
  failed_searches: number;
  search_count: number;
  demand_score: number;
  demand_level: string;
  revenue: number;
  temperature: number;
  humidity: number;
  rain: boolean;
  weather_type: string;
  festival: boolean;
  holiday: boolean;
  diwali: boolean;
  holi: boolean;
  christmas: boolean;
  navratri: boolean;
  eid: boolean;
  raksha_bandhan: boolean;
  independence_day: boolean;
  weekend: boolean;
  day: number;
  week: number;
  month: number;
  quarter: number;
  year: number;
  day_of_week: number;
  moving_avg_7: number;
  moving_avg_30: number;
  sales_growth: number;
  inventory_turnover: number;
  days_since_last_purchase: number | null;
  seasonal_indicator: string;
  weather_score: number;
}

export interface AIDatasetSummary {
  dataset_size: number;
  columns: string[];
  missing_columns: string[];
  duplicate_records_removed: number;
  validation_errors: string[];
  last_training_time: string | null;
  training_status: "READY" | "WAITING_FOR_DATA" | string;
  available_models: string[];
}

export interface AIDatasetResponse {
  items: AIDatasetRow[];
  total: number;
  limit: number;
  offset: number;
  summary: AIDatasetSummary;
}

export interface AIDatasetSummaryResponse {
  total_rows: number;
  total_products: number;
  total_categories: number;
  total_cities: number;
  total_states: number;
  total_warehouses: number;
  missing_values: number;
  dataset_size_mb: number;
  start_date: string;
  end_date: string;
}

export interface DatasetValidationResponse {
  status: string;
  total_rows: number;
  total_columns: number;
  missing_values: number;
  duplicate_rows: number;
  negative_values: number;
  invalid_dates: number;
  issues: string[];
}

export interface PreprocessResponse {
  status: string;
  rows_processed: number;
  columns_processed: number;
  missing_values_before: number;
  missing_values_after: number;
  duplicates_removed: number;
  encoded_columns: string[];
  scaled_columns: string[];
  sample: Record<string, any>[];
}

export interface FeatureListResponse {
  selected_features: string[];
  target: string;
  removed_features: string[];
  feature_count: number;
}

export interface TrainTestSplitResponse {
  total_rows: number;
  train_size: number;
  test_size: number;
  validation_size: number;
  train_ratio: number;
  test_ratio: number;
  validation_ratio: number;
}

export interface PipelineStep {
  name: string;
  status: "READY" | "DONE" | "PENDING" | string;
}

export interface PipelineStatusResponse {
  status: string;
  steps: PipelineStep[];
  last_run_at: string | null;
  dataset_rows: number;
  selected_features: number;
}

export interface RegressionMetrics {
  trained: boolean;
  mae: number;
  rmse: number;
  r2: number;
  accuracy_percentage: string;
}

export interface ClassificationMetrics {
  trained: boolean;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusion_matrix: number[][];
}

export interface ModelMetricsResponse {
  demand: RegressionMetrics;
  sales: RegressionMetrics;
  stockout: ClassificationMetrics;
  reorder: RegressionMetrics;
}

export interface DemandPredictionInput {
  product: string;
  current_stock: number;
  search_count: number;
  failed_searches: number;
  sales: number;
  festival: boolean;
  temperature: number;
  demand_score: number;
}

export interface DemandPredictionResponse {
  predicted_demand: number;
  confidence_score: number;
}

export interface SalesPredictionInput {
  today_sales: number;
  yesterday_sales: number;
  stock: number;
  category: string;
  festival: boolean;
  weather: number;
  search_count: number;
}

export interface SalesPredictionResponse {
  predicted_sales: number;
  formatted_sales: string;
  confidence_score: number;
}

export interface StockoutPredictionInput {
  current_stock: number;
  average_daily_sales: number;
  demand_score: number;
  warehouse: string;
  festival: boolean;
  weather: number;
}

export interface StockoutPredictionResponse {
  stockout_risk: "High" | "Medium" | "Low" | string;
  stockout_probability: number;
  risk_code: number;
}

export interface ReorderPredictionInput {
  average_sales: number;
  demand: number;
  festival: boolean;
  weather: number;
  warehouse: string;
  lead_time: number;
  supplier_delay: number;
  current_stock: number;
}

export interface ReorderPredictionResponse {
  recommended_quantity: number;
  days_of_stock_left: number;
}


