import { api } from "@/services/api";
import type { 
  AIDatasetResponse, 
  AIDatasetSummaryResponse,
  DatasetValidationResponse,
  PreprocessResponse,
  FeatureListResponse,
  TrainTestSplitResponse,
  PipelineStatusResponse,
  DemandPredictionInput,
  DemandPredictionResponse,
  SalesPredictionInput,
  SalesPredictionResponse,
  StockoutPredictionInput,
  StockoutPredictionResponse,
  ReorderPredictionInput,
  ReorderPredictionResponse,
} from "../types";

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const aiDatasetService = {
  async getDataset(params: { limit: number; offset: number }): Promise<AIDatasetResponse> {
    const response = await api.get<AIDatasetResponse>("/ai/dataset", { params });
    return response.data;
  },

  async getDatasetSummary(): Promise<AIDatasetSummaryResponse> {
    const response = await api.get<AIDatasetSummaryResponse>("/ai/dataset/summary");
    return response.data;
  },

  async exportCsv() {
    const response = await api.get<string>("/ai/dataset/export", {
      responseType: "text",
    });
    downloadFile("ai_training_dataset.csv", response.data, "text/csv;charset=utf-8");
  },

  async validate(): Promise<DatasetValidationResponse> {
    const response = await api.post<DatasetValidationResponse>("/ai/validate");
    return response.data;
  },

  async preprocess(): Promise<PreprocessResponse> {
    const response = await api.post<PreprocessResponse>("/ai/preprocess");
    return response.data;
  },

  async getFeatures(): Promise<FeatureListResponse> {
    const response = await api.get<FeatureListResponse>("/ai/features");
    return response.data;
  },

  async trainTestSplit(test_ratio = 0.2, validation_ratio = 0.0): Promise<TrainTestSplitResponse> {
    const response = await api.post<TrainTestSplitResponse>("/ai/train-test-split", null, {
      params: { test_ratio, validation_ratio }
    });
    return response.data;
  },

  async getPipelineStatus(): Promise<PipelineStatusResponse> {
    const response = await api.get<PipelineStatusResponse>("/ai/pipeline/status");
    return response.data;
  },

  async train(): Promise<{ status: string; message: string; metrics: any }> {
    const response = await api.post("/ai/train");
    return response.data;
  },

  async getModels(): Promise<any> {
    const response = await api.get("/ai/models");
    return response.data;
  },

  async predictDemand(input: DemandPredictionInput): Promise<DemandPredictionResponse> {
    const response = await api.post<DemandPredictionResponse>("/ai/predict/demand", input);
    return response.data;
  },

  async predictSales(input: SalesPredictionInput): Promise<SalesPredictionResponse> {
    const response = await api.post<SalesPredictionResponse>("/ai/predict/sales", input);
    return response.data;
  },

  async predictStockout(input: StockoutPredictionInput): Promise<StockoutPredictionResponse> {
    const response = await api.post<StockoutPredictionResponse>("/ai/predict/stockout", input);
    return response.data;
  },

  async predictReorder(input: ReorderPredictionInput): Promise<ReorderPredictionResponse> {
    const response = await api.post<ReorderPredictionResponse>("/ai/predict/reorder", input);
    return response.data;
  },

  async getAIContext(): Promise<any> {
    const response = await api.get("/ai/context");
    return response.data;
  },

  async getAIRecommendations(): Promise<any> {
    const response = await api.get("/ai/recommendations");
    return response.data;
  },

  async getWeatherCurrent(city: string = "Delhi"): Promise<any> {
    const response = await api.get("/weather/current", { params: { city } });
    return response.data;
  },

  async getWeatherForecast(city: string = "Delhi"): Promise<any> {
    const response = await api.get("/weather/forecast", { params: { city } });
    return response.data;
  },

  async getWeatherHistory(city: string = "Delhi", days: number = 30): Promise<any[]> {
    const response = await api.get("/weather/history", { params: { city, days } });
    return response.data;
  },

  async getUpcomingFestivals(): Promise<any[]> {
    const response = await api.get("/festival/upcoming");
    return response.data;
  },

  async getCurrentSeason(): Promise<any> {
    const response = await api.get("/season/current");
    return response.data;
  },
};

export default aiDatasetService;


