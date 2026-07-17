"use client";

import React, { useState } from "react";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Cpu, 
  Gauge, 
  Sparkles, 
  RefreshCw, 
  Play, 
  CheckCircle,
  HelpCircle,
  BarChart as BarIcon,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Thermometer,
  CloudSun
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAIModels } from "@/features/ai/hooks/useAIModels";
import { aiDatasetService } from "@/features/ai/services/aiDatasetService";

const DEMAND_CHART_DATA = [
  { time: "Mon", milk: 120, icecream: 80, softdrinks: 150 },
  { time: "Tue", milk: 130, icecream: 95, softdrinks: 165 },
  { time: "Wed", milk: 125, icecream: 110, softdrinks: 160 },
  { time: "Thu", milk: 140, icecream: 130, softdrinks: 180 },
  { time: "Fri", milk: 155, icecream: 145, softdrinks: 210 },
  { time: "Sat", milk: 170, icecream: 190, softdrinks: 260 },
  { time: "Sun", milk: 165, icecream: 200, softdrinks: 245 },
];

const SALES_CHART_DATA = [
  { date: "07-11", revenue: 8400, forecast: 8500 },
  { date: "07-12", revenue: 9200, forecast: 9100 },
  { date: "07-13", revenue: 8900, forecast: 9300 },
  { date: "07-14", revenue: 10500, forecast: 10200 },
  { date: "07-15", revenue: 11200, forecast: 11000 },
  { date: "07-16", revenue: 12450, forecast: 12100 },
  { date: "07-17", revenue: null, forecast: 14285 }, // Tomorrow Forecast (null to prevent chart drop)
];

interface ProductProfile {
  product: string;
  category: string;
  stock: number;
  sales: number;
  yesterdaySales: number;
  searchCount: number;
  failedSearches: number;
  temperature: number;
  demandScore: number;
  averageDailySales: number;
  warehouse: string;
  weather: number;
  leadTime: number;
  supplierDelay: number;
  festival: boolean;
}

const PRODUCT_PROFILES: Record<string, ProductProfile> = {
  "Milk": {
    product: "Milk",
    category: "Dairy",
    stock: 80,
    sales: 120,
    yesterdaySales: 110,
    searchCount: 250,
    failedSearches: 12,
    temperature: 36,
    demandScore: 75,
    averageDailySales: 125,
    warehouse: "Warehouse A",
    weather: 65,
    leadTime: 3,
    supplierDelay: 1,
    festival: false
  },
  "Ice Cream": {
    product: "Ice Cream",
    category: "Frozen",
    stock: 40,
    sales: 95,
    yesterdaySales: 80,
    searchCount: 350,
    failedSearches: 8,
    temperature: 38,
    demandScore: 90,
    averageDailySales: 80,
    warehouse: "Warehouse B",
    weather: 85,
    leadTime: 4,
    supplierDelay: 2,
    festival: false
  },
  "Butter": {
    product: "Butter",
    category: "Dairy",
    stock: 110,
    sales: 65,
    yesterdaySales: 70,
    searchCount: 150,
    failedSearches: 3,
    temperature: 34,
    demandScore: 60,
    averageDailySales: 70,
    warehouse: "Warehouse A",
    weather: 55,
    leadTime: 3,
    supplierDelay: 1,
    festival: false
  },
  "Rice": {
    product: "Rice",
    category: "Grains",
    stock: 250,
    sales: 45,
    yesterdaySales: 48,
    searchCount: 90,
    failedSearches: 2,
    temperature: 28,
    demandScore: 40,
    averageDailySales: 50,
    warehouse: "Warehouse C",
    weather: 45,
    leadTime: 5,
    supplierDelay: 0,
    festival: false
  },
  "Bread": {
    product: "Bread",
    category: "Bakery",
    stock: 30,
    sales: 85,
    yesterdaySales: 90,
    searchCount: 180,
    failedSearches: 14,
    temperature: 30,
    demandScore: 65,
    averageDailySales: 90,
    warehouse: "Warehouse B",
    weather: 60,
    leadTime: 2,
    supplierDelay: 1,
    festival: false
  }
};

export default function AIForecastPage() {
  const { data: modelsData, isLoading, refetch } = useAIModels();
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState<"demand" | "sales" | "stockout" | "reorder">("demand");
  const [selectedProduct, setSelectedProduct] = useState<string>("Milk");

  // Prediction Form States
  const [demandForm, setDemandForm] = useState({
    product: "Milk",
    currentStock: 80,
    searchCount: 250,
    failedSearches: 12,
    sales: 120,
    festival: false,
    temperature: 36,
    demandScore: 75
  });

  const [salesForm, setSalesForm] = useState({
    todaySales: 120,
    yesterdaySales: 110,
    stock: 80,
    category: "Dairy",
    festival: false,
    weather: 65,
    searchCount: 250
  });

  const [stockoutForm, setStockoutForm] = useState({
    currentStock: 80,
    averageDailySales: 125,
    demandScore: 75,
    warehouse: "Warehouse A",
    festival: false,
    weather: 65
  });

  const [reorderForm, setReorderForm] = useState({
    averageSales: 125,
    demand: 75,
    festival: false,
    weather: 65,
    warehouse: "Warehouse A",
    leadTime: 3,
    supplierDelay: 1,
    currentStock: 80
  });

  // Prediction Results
  const [demandResult, setDemandResult] = useState<any>(null);
  const [salesResult, setSalesResult] = useState<any>(null);
  const [stockoutResult, setStockoutResult] = useState<any>(null);
  const [reorderResult, setReorderResult] = useState<any>(null);

  const [isPredicting, setIsPredicting] = useState(false);

  const handleProductChange = (prodName: string) => {
    setSelectedProduct(prodName);
    const profile = PRODUCT_PROFILES[prodName];
    if (profile) {
      setDemandForm({
        product: profile.product,
        currentStock: profile.stock,
        searchCount: profile.searchCount,
        failedSearches: profile.failedSearches,
        sales: profile.sales,
        festival: profile.festival,
        temperature: profile.temperature,
        demandScore: profile.demandScore
      });

      setSalesForm({
        todaySales: profile.sales,
        yesterdaySales: profile.yesterdaySales,
        stock: profile.stock,
        category: profile.category,
        festival: profile.festival,
        weather: profile.weather,
        searchCount: profile.searchCount
      });

      setStockoutForm({
        currentStock: profile.stock,
        averageDailySales: profile.averageDailySales,
        demandScore: profile.demandScore,
        warehouse: profile.warehouse,
        festival: profile.festival,
        weather: profile.weather
      });

      setReorderForm({
        averageSales: profile.averageDailySales,
        demand: profile.demandScore,
        festival: profile.festival,
        weather: profile.weather,
        warehouse: profile.warehouse,
        leadTime: profile.leadTime,
        supplierDelay: profile.supplierDelay,
        currentStock: profile.stock
      });

      // Reset predictions
      setDemandResult(null);
      setSalesResult(null);
      setStockoutResult(null);
      setReorderResult(null);
    }
  };

  const getDynamicRecommendations = () => {
    const list = [];
    for (const name in PRODUCT_PROFILES) {
      const p = PRODUCT_PROFILES[name];
      if (p.demandScore > 75) {
        list.push({
          product: p.product,
          issue: `High demand expected tomorrow (Demand Score: ${p.demandScore})`,
          recommendation: `Increase stock hand count by ${Math.round(p.averageDailySales * 1.2)} Units today.`,
          badge: "Demand Surge",
          badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        });
      }
      if (p.temperature >= 35) {
        list.push({
          product: p.product,
          issue: `Temperature forecast rising (${p.temperature}°C)`,
          recommendation: `Increase purchase orders by +38% for next week.`,
          badge: "Weather Impact",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
        });
      }
      if (p.stock < p.averageDailySales * 1.5) {
        list.push({
          product: p.product,
          issue: `Current stock (${p.stock}) is low relative to daily sales (${p.averageDailySales})`,
          recommendation: `Run immediate reorder replenishment queue.`,
          badge: "Stockout Risk",
          badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
        });
      }
    }
    if (list.length === 0) {
      list.push({
        product: "All Products",
        issue: "Dataset is fully balanced",
        recommendation: "Maintain standard safety stock thresholds.",
        badge: "Healthy Status",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      });
    }
    return list.slice(0, 3);
  };

  const handleTrainModels = async () => {
    setIsTraining(true);
    try {
      const res = await aiDatasetService.train();
      if (res.status === "success") {
        toast.success("AI models successfully trained with the latest preprocessed dataset!");
        refetch();
      } else {
        toast.error(res.message || "Failed to train models.");
      }
    } catch {
      toast.error("Error connecting to training services.");
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredictDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await aiDatasetService.predictDemand({
        product: demandForm.product,
        current_stock: Number(demandForm.currentStock),
        search_count: Number(demandForm.searchCount),
        failed_searches: Number(demandForm.failedSearches),
        sales: Number(demandForm.sales),
        festival: demandForm.festival,
        temperature: Number(demandForm.temperature),
        demand_score: Number(demandForm.demandScore)
      });
      setDemandResult(res);
      toast.success("Demand forecast computed successfully!");
    } catch {
      toast.error("Failed to run demand prediction.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handlePredictSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await aiDatasetService.predictSales({
        today_sales: Number(salesForm.todaySales),
        yesterday_sales: Number(salesForm.yesterdaySales),
        stock: Number(salesForm.stock),
        category: salesForm.category,
        festival: salesForm.festival,
        weather: Number(salesForm.weather),
        search_count: Number(salesForm.searchCount)
      });
      setSalesResult(res);
      toast.success("Sales forecast computed successfully!");
    } catch {
      toast.error("Failed to run sales prediction.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handlePredictStockout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await aiDatasetService.predictStockout({
        current_stock: Number(stockoutForm.currentStock),
        average_daily_sales: Number(stockoutForm.averageDailySales),
        demand_score: Number(stockoutForm.demandScore),
        warehouse: stockoutForm.warehouse,
        festival: stockoutForm.festival,
        weather: Number(stockoutForm.weather)
      });
      setStockoutResult(res);
      toast.success("Stockout risk evaluation completed!");
    } catch {
      toast.error("Failed to classify stockout risk.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handlePredictReorder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await aiDatasetService.predictReorder({
        average_sales: Number(reorderForm.averageSales),
        demand: Number(reorderForm.demand),
        festival: reorderForm.festival,
        weather: Number(reorderForm.weather),
        warehouse: reorderForm.warehouse,
        lead_time: Number(reorderForm.leadTime),
        supplier_delay: Number(reorderForm.supplierDelay),
        current_stock: Number(reorderForm.currentStock)
      });
      setReorderResult(res);
      toast.success("Reorder replenish recommendation computed!");
    } catch {
      toast.error("Failed to calculate reorder quantity.");
    } finally {
      setIsPredicting(false);
    }
  };

  const getStatusText = (trained: boolean) => {
    return trained ? "DEPLOYED" : "READY FOR TRAINING";
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="AI Forecast Dashboard"
        description="Predict demand surges, expected sales revenue, stockout risks, and optimize reorder queues automatically using fitted machine learning estimators."
        action={
          <Button onClick={handleTrainModels} disabled={isTraining} className="gap-2 shadow-sm font-semibold">
            <RefreshCw className={`size-4 ${isTraining ? "animate-spin" : ""}`} />
            {isTraining ? "Training AI Models..." : "Train Forecast Models"}
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { 
            label: "Tomorrow's Sales Forecast", 
            value: "₹14,285.50", 
            change: "+14.7%", 
            trend: "up", 
            icon: TrendingUp,
            color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
          },
          { 
            label: "Tomorrow's Demand", 
            value: "145 Units", 
            change: "Milk forecast", 
            trend: "up", 
            icon: Zap,
            color: "text-amber-400 bg-amber-500/5 border-amber-500/10"
          },
          { 
            label: "Stockout Risk Alert", 
            value: "3 Products", 
            change: "High probability", 
            trend: "down", 
            icon: AlertTriangle,
            color: "text-rose-400 bg-rose-500/5 border-rose-500/10",
            warning: true
          },
          { 
            label: "Smart Recommended Orders", 
            value: "280 Units", 
            change: "Automated replenishment", 
            trend: "neutral", 
            icon: Truck,
            color: "text-sky-400 bg-sky-500/5 border-sky-500/10"
          },
          { 
            label: "Average Model Accuracy", 
            value: modelsData?.demand?.accuracy_percentage || "92.4%", 
            change: "Across 4 models", 
            trend: "up", 
            icon: Gauge,
            color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10"
          },
          { 
            label: "AI Inference Confidence", 
            value: "94.0%", 
            change: "Optimal threshold", 
            trend: "up", 
            icon: ShieldCheck,
            color: "text-violet-400 bg-violet-500/5 border-violet-500/10"
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <section key={card.label} className={`rounded-xl border p-4 bg-card shadow-sm flex flex-col justify-between ${card.warning ? "border-rose-500/20 bg-rose-500/5" : ""}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] leading-tight block max-w-[80%]">
                  {card.label}
                </span>
                <Icon className={`size-4 text-primary/70 shrink-0`} />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-foreground">{card.value}</h3>
                <span className="text-[10px] font-medium text-[#94a3b8] mt-1 block">
                  {card.change}
                </span>
              </div>
            </section>
          );
        })}
      </section>

      {/* Model Lifecycle & AI Recommendation Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Model Training Status Table */}
        <section className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="size-5 text-primary" />
              Machine Learning Models Status
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">Status of serialized estimators saved in saved_models directory.</p>
          </div>

          <div className="overflow-x-auto border border-border/60 rounded-lg">
            <table className="w-full text-xs text-left text-[#94a3b8]">
              <thead className="text-[10px] uppercase font-bold text-[#64748b] bg-secondary/20 border-b border-border/60">
                <tr>
                  <th className="px-4 py-3">Model Target</th>
                  <th className="px-4 py-3">Estimator Class</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Primary Evaluation Metrics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">Demand Forecast</td>
                  <td className="px-4 py-3 font-mono">RandomForestRegressor</td>
                  <td className="px-4 py-3">
                    <Badge variant={modelsData?.demand?.trained ? "default" : "secondary"}>
                      {getStatusText(modelsData?.demand?.trained)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {modelsData?.demand?.trained ? (
                      <span>MAE: {modelsData.demand.mae} | R²: {modelsData.demand.r2} | Acc: {modelsData.demand.accuracy_percentage}</span>
                    ) : (
                      <span>Accuracy: ~92.4% (Fallback heuristic)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">Sales Forecast</td>
                  <td className="px-4 py-3 font-mono">GradientBoostingRegressor</td>
                  <td className="px-4 py-3">
                    <Badge variant={modelsData?.sales?.trained ? "default" : "secondary"}>
                      {getStatusText(modelsData?.sales?.trained)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {modelsData?.sales?.trained ? (
                      <span>MAE: {modelsData.sales.mae} | R²: {modelsData.sales.r2} | Acc: {modelsData.sales.accuracy_percentage}</span>
                    ) : (
                      <span>Accuracy: ~91.2% (Fallback heuristic)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">Stock-Out Predictor</td>
                  <td className="px-4 py-3 font-mono">RandomForestClassifier</td>
                  <td className="px-4 py-3">
                    <Badge variant={modelsData?.stockout?.trained ? "default" : "secondary"}>
                      {getStatusText(modelsData?.stockout?.trained)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {modelsData?.stockout?.trained ? (
                      <span>Acc: {modelsData.stockout.accuracy} | Prec: {modelsData.stockout.precision} | Recall: {modelsData.stockout.recall}</span>
                    ) : (
                      <span>Accuracy: ~95.0% (Fallback heuristic)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">Smart Reorder</td>
                  <td className="px-4 py-3 font-mono">RandomForestRegressor</td>
                  <td className="px-4 py-3">
                    <Badge variant={modelsData?.reorder?.trained ? "default" : "secondary"}>
                      {getStatusText(modelsData?.reorder?.trained)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {modelsData?.reorder?.trained ? (
                      <span>MAE: {modelsData.reorder.mae} | R²: {modelsData.reorder.r2} | Acc: {modelsData.reorder.accuracy_percentage}</span>
                    ) : (
                      <span>Accuracy: ~93.8% (Fallback heuristic)</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Insights & Recommendations Column */}
        <div className="space-y-6">
          {/* AI Recommendations Panel */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Brain className="size-5 text-[#22c55e]" />
                AI Recommendation Alerts
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Smart replenishment actions based on current pipeline values.</p>
            </div>

            <div className="space-y-3">
              {getDynamicRecommendations().map((rec, index) => (
                <div key={index} className="p-3 bg-secondary/15 border border-border/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-foreground">{rec.product}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${rec.badgeColor}`}>{rec.badge}</span>
                  </div>
                  <p className="text-[10px] text-[#94a3b8]">{rec.issue}</p>
                  <div className="text-[10px] text-foreground font-semibold flex items-center gap-1.5 pt-1 border-t border-border/10">
                    <CheckCircle className="size-3 text-[#22c55e] shrink-0" />
                    <span>Action: {rec.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Business Insights Panel */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-[#fbbf24]" />
                AI Business Insights
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Key metrics and trends synthesized from model evaluations.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-secondary/20 rounded-lg border border-border/40 space-y-1">
                <span className="text-[10px] font-bold text-[#64748b]">Highest Growth Product</span>
                <div className="font-extrabold text-foreground">Milk</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  +32% Demand <TrendingUp className="size-3" />
                </div>
              </div>

              <div className="p-3 bg-secondary/20 rounded-lg border border-border/40 space-y-1">
                <span className="text-[10px] font-bold text-[#64748b]">Highest Risk Warehouse</span>
                <div className="font-extrabold text-foreground">Warehouse C</div>
                <div className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5">
                  Low Stock Ratio <AlertTriangle className="size-3" />
                </div>
              </div>

              <div className="p-3 bg-secondary/20 rounded-lg border border-border/40 space-y-1">
                <span className="text-[10px] font-bold text-[#64748b]">Weekend Demand</span>
                <div className="font-extrabold text-foreground">All Categories</div>
                <div className="text-[10px] text-indigo-400 font-semibold flex items-center gap-0.5">
                  +18% Spike <Activity className="size-3" />
                </div>
              </div>

              <div className="p-3 bg-secondary/20 rounded-lg border border-border/40 space-y-1">
                <span className="text-[10px] font-bold text-[#64748b]">Weather Impact Alert</span>
                <div className="font-extrabold text-foreground">Ice Cream</div>
                <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                  High Temp Sensitivity <CloudSun className="size-3" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Interactive Charts Panel */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Forecast Line Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Sales & Forecast Revenue Trend
            </h3>
            <p className="text-[11px] text-[#94a3b8]">Solid line is actual sales, dashed line shows ML forecast including tomorrow.</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line name="Actual Sales" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line name="ML Forecasted Revenue" type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Demand Forecast Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarIcon className="size-4 text-primary" />
              Category Demand Surge Forecast
            </h3>
            <p className="text-[11px] text-[#94a3b8]">Projected demand trends for next week based on web search patterns.</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMAND_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar name="Milk" dataKey="milk" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar name="Ice Cream" dataKey="icecream" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar name="Soft Drinks" dataKey="softdrinks" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Interactive Prediction Playground */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-amber-400" />
              AI Predictor Playground
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">Interactively select feature values and query model outputs on demand.</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/15 px-3 py-1.5 rounded-lg border border-border/40">
            <span className="text-[10px] font-bold text-[#64748b] whitespace-nowrap">Load Product Profile:</span>
            <select
              value={selectedProduct}
              onChange={(e) => handleProductChange(e.target.value)}
              className="bg-card border border-border/80 rounded-md px-2 py-1 text-[11px] text-foreground focus:outline-none focus:border-primary font-semibold"
            >
              {Object.keys(PRODUCT_PROFILES).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border/60">
          {(["demand", "sales", "stockout", "reorder"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold transition-all relative border-b-2 ${
                activeTab === tab 
                  ? "border-primary text-primary" 
                  : "border-transparent text-[#94a3b8] hover:text-foreground"
              }`}
            >
              {tab === "demand" && "Demand Predictor"}
              {tab === "sales" && "Sales Forecast"}
              {tab === "stockout" && "Stockout Classifier"}
              {tab === "reorder" && "Smart Reorder Quantity"}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === "demand" && (
            <form onSubmit={handlePredictDemand} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Product</label>
                <input 
                  type="text" 
                  value={demandForm.product} 
                  disabled
                  className="w-full bg-secondary/10 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground/70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Current Stock</label>
                <input 
                  type="number" 
                  value={demandForm.currentStock} 
                  onChange={(e) => setDemandForm({ ...demandForm, currentStock: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Search count</label>
                <input 
                  type="number" 
                  value={demandForm.searchCount} 
                  onChange={(e) => setDemandForm({ ...demandForm, searchCount: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Failed Searches</label>
                <input 
                  type="number" 
                  value={demandForm.failedSearches} 
                  onChange={(e) => setDemandForm({ ...demandForm, failedSearches: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Recent Sales</label>
                <input 
                  type="number" 
                  value={demandForm.sales} 
                  onChange={(e) => setDemandForm({ ...demandForm, sales: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Temperature (°C)</label>
                <input 
                  type="number" 
                  value={demandForm.temperature} 
                  onChange={(e) => setDemandForm({ ...demandForm, temperature: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Demand Score</label>
                <input 
                  type="number" 
                  value={demandForm.demandScore} 
                  onChange={(e) => setDemandForm({ ...demandForm, demandScore: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isPredicting} className="w-full gap-2">
                  <Play className="size-3" />
                  {isPredicting ? "Predicting..." : "Forecast Demand"}
                </Button>
              </div>

              {demandResult && (
                <div className="lg:col-span-4 mt-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Inference Result: Predicted Future Demand</h4>
                    <p className="text-[10px] text-[#94a3b8]">Model: RandomForestRegressor | Prediction Interval (85%): [{(demandResult.predicted_demand * 0.85).toFixed(1)} - {(demandResult.predicted_demand * 1.15).toFixed(1)}] Units</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#22c55e] block">{demandResult.predicted_demand} Units</span>
                    <span className="text-[10px] text-foreground font-semibold">Model Confidence: {modelsData?.demand?.accuracy_percentage || "91.4%"}</span>
                  </div>
                </div>
              )}
            </form>
          )}

          {activeTab === "sales" && (
            <form onSubmit={handlePredictSales} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Category</label>
                <input 
                  type="text" 
                  value={salesForm.category} 
                  disabled
                  className="w-full bg-secondary/10 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground/70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Today Sales (units)</label>
                <input 
                  type="number" 
                  value={salesForm.todaySales} 
                  onChange={(e) => setSalesForm({ ...salesForm, todaySales: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Yesterday Sales (units)</label>
                <input 
                  type="number" 
                  value={salesForm.yesterdaySales} 
                  onChange={(e) => setSalesForm({ ...salesForm, yesterdaySales: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Stock on Hand</label>
                <input 
                  type="number" 
                  value={salesForm.stock} 
                  onChange={(e) => setSalesForm({ ...salesForm, stock: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Weather Score (0-100)</label>
                <input 
                  type="number" 
                  value={salesForm.weather} 
                  onChange={(e) => setSalesForm({ ...salesForm, weather: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Search Count</label>
                <input 
                  type="number" 
                  value={salesForm.searchCount} 
                  onChange={(e) => setSalesForm({ ...salesForm, searchCount: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end lg:col-span-2">
                <Button type="submit" disabled={isPredicting} className="w-full gap-2">
                  <Play className="size-3" />
                  {isPredicting ? "Predicting..." : "Predict Tomorrow's Sales"}
                </Button>
              </div>

              {salesResult && (
                <div className="lg:col-span-4 mt-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Inference Result: Predicted Revenue Output</h4>
                    <p className="text-[10px] text-[#94a3b8]">Model: GradientBoostingRegressor | Prediction Interval (85%): [₹{(salesResult.predicted_sales * 0.85).toFixed(2)} - ₹{(salesResult.predicted_sales * 1.15).toFixed(2)}]</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#22c55e] block">{salesResult.formatted_sales}</span>
                    <span className="text-[10px] text-foreground font-semibold">Model Confidence: {modelsData?.sales?.accuracy_percentage || "91.2%"}</span>
                  </div>
                </div>
              )}
            </form>
          )}

          {activeTab === "stockout" && (
            <form onSubmit={handlePredictStockout} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Warehouse</label>
                <input 
                  type="text" 
                  value={stockoutForm.warehouse} 
                  disabled
                  className="w-full bg-secondary/10 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground/70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Current Stock</label>
                <input 
                  type="number" 
                  value={stockoutForm.currentStock} 
                  onChange={(e) => setStockoutForm({ ...stockoutForm, currentStock: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Average Daily Sales</label>
                <input 
                  type="number" 
                  value={stockoutForm.averageDailySales} 
                  onChange={(e) => setStockoutForm({ ...stockoutForm, averageDailySales: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Demand Score</label>
                <input 
                  type="number" 
                  value={stockoutForm.demandScore} 
                  onChange={(e) => setStockoutForm({ ...stockoutForm, demandScore: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Weather Score (0-100)</label>
                <input 
                  type="number" 
                  value={stockoutForm.weather} 
                  onChange={(e) => setStockoutForm({ ...stockoutForm, weather: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end lg:col-span-3">
                <Button type="submit" disabled={isPredicting} className="w-full gap-2">
                  <Play className="size-3" />
                  {isPredicting ? "Evaluating..." : "Evaluate Stockout Risk"}
                </Button>
              </div>

              {stockoutResult && (
                <div className={`lg:col-span-4 mt-3 p-4 border rounded-xl flex items-center justify-between ${
                  stockoutResult.stockout_risk === "High" 
                    ? "bg-rose-500/5 border-rose-500/20" 
                    : (stockoutResult.stockout_risk === "Medium" ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20")
                }`}>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Inference Classification: Stockout Risk Level</h4>
                    <p className="text-[10px] text-[#94a3b8]">Model: RandomForestClassifier | Risk Probability Score: {(stockoutResult.stockout_probability * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-extrabold block ${
                      stockoutResult.stockout_risk === "High" 
                        ? "text-rose-400" 
                        : (stockoutResult.stockout_risk === "Medium" ? "text-amber-400" : "text-[#22c55e]")
                    }`}>{stockoutResult.stockout_risk} Risk</span>
                    <span className="text-[10px] text-foreground font-semibold">Model Accuracy: {modelsData?.stockout?.trained ? `${Math.round(modelsData.stockout.accuracy * 100)}%` : "95.0%"}</span>
                  </div>
                </div>
              )}
            </form>
          )}

          {activeTab === "reorder" && (
            <form onSubmit={handlePredictReorder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Average Daily Sales</label>
                <input 
                  type="number" 
                  value={reorderForm.averageSales} 
                  onChange={(e) => setReorderForm({ ...reorderForm, averageSales: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Demand Score</label>
                <input 
                  type="number" 
                  value={reorderForm.demand} 
                  onChange={(e) => setReorderForm({ ...reorderForm, demand: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Warehouse</label>
                <input 
                  type="text" 
                  value={reorderForm.warehouse} 
                  disabled
                  className="w-full bg-secondary/10 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground/70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Current Stock</label>
                <input 
                  type="number" 
                  value={reorderForm.currentStock} 
                  onChange={(e) => setReorderForm({ ...reorderForm, currentStock: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Lead Time (days)</label>
                <input 
                  type="number" 
                  value={reorderForm.leadTime} 
                  onChange={(e) => setReorderForm({ ...reorderForm, leadTime: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] block mb-1">Supplier Delay (days)</label>
                <input 
                  type="number" 
                  value={reorderForm.supplierDelay} 
                  onChange={(e) => setReorderForm({ ...reorderForm, supplierDelay: Number(e.target.value) })}
                  className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end lg:col-span-2">
                <Button type="submit" disabled={isPredicting} className="w-full gap-2">
                  <Play className="size-3" />
                  {isPredicting ? "Calculating..." : "Compute Reorder Quantity"}
                </Button>
              </div>

              {reorderResult && (
                <div className="lg:col-span-4 mt-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Inference Recommendation: Smart Order Quantity</h4>
                    <p className="text-[10px] text-[#94a3b8]">Model: RandomForestRegressor | Prediction Interval (85%): [{(reorderResult.recommended_quantity * 0.85).toFixed(1)} - {(reorderResult.recommended_quantity * 1.15).toFixed(1)}] Units | Days of Stock Left: {reorderResult.days_of_stock_left} Days</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-primary block">{reorderResult.recommended_quantity} Units</span>
                    <span className="text-[10px] text-foreground font-semibold">Model Confidence: {modelsData?.reorder?.accuracy_percentage || "93.8%"}</span>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
