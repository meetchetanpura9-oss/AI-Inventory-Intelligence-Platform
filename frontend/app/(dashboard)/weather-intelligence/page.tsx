"use client";

import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity, 
  TrendingUp,
  Brain,
  AlertTriangle,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiDatasetService } from "@/features/ai/services/aiDatasetService";

export default function WeatherIntelligencePage() {
  const [city, setCity] = useState("Delhi");
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [aiContext, setAiContext] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async (cityName: string) => {
    setIsLoading(true);
    try {
      const [current, fc, context, recs] = await Promise.all([
        aiDatasetService.getWeatherCurrent(cityName),
        aiDatasetService.getWeatherForecast(cityName),
        aiDatasetService.getAIContext(),
        aiDatasetService.getAIRecommendations()
      ]);
      setWeatherData(current);
      setForecast(fc);
      setAiContext(context);
      setRecommendations(recs.filter((r: any) => r.type === "Weather Alert" || r.type === "Seasonal demand"));
    } catch (err) {
      toast.error("Failed to load weather intelligence data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(city);
  }, [city]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData(city);
    setIsRefreshing(false);
    toast.success("Weather telemetry and seasonal indices refreshed successfully!");
  };

  // Mock Sales Correlation Chart Data
  const CORRELATION_DATA = [
    { day: "Mon", temp: 34, sales: 120, humidity: 45 },
    { day: "Tue", temp: 36, sales: 135, humidity: 40 },
    { day: "Wed", temp: 38, sales: 158, humidity: 38 },
    { day: "Thu", temp: 39, sales: 180, humidity: 35 },
    { day: "Fri", temp: 37, sales: 165, humidity: 42 },
    { day: "Sat", temp: 35, sales: 140, humidity: 50 },
    { day: "Sun", temp: 38, sales: 175, humidity: 45 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Activity className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <PageHeader 
          title="AI Weather & Seasonal Intelligence" 
          description="Transforming stock levels using meteorological demand drivers and seasonal alignments." 
        />
        <div className="flex items-center gap-3">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
          >
            <option value="Delhi">Delhi Depot (North)</option>
            <option value="Mumbai">Mumbai Depot (West)</option>
            <option value="Bangalore">Bangalore Depot (South)</option>
          </select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync Telemetry
          </Button>
        </div>
      </div>

      {/* Weather & Seasonal Status Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Current Temperature</span>
            <Thermometer className="size-4 text-rose-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{weatherData?.temperature}°C</h3>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              Heat Index: {weatherData?.heat_index}°C
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Precipitation / Rain</span>
            <Compass className="size-4 text-blue-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{weatherData?.rainfall} mm</h3>
            <span className="text-[10px] text-[#94a3b8] font-semibold block mt-1">
              Type: {weatherData?.weather_type}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Relative Humidity</span>
            <Droplets className="size-4 text-cyan-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{weatherData?.humidity}%</h3>
            <span className="text-[10px] text-amber-400 font-semibold block mt-1">
              Wind: {weatherData?.wind_speed} km/h
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Seasonal Demand Engine</span>
            <CloudSun className="size-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-foreground">{aiContext?.season?.season}</h3>
            <Badge variant="outline" className="mt-1 border-amber-500/20 text-amber-400 bg-amber-500/5">
              Active Season Badge
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Insights section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Seasonal maps & Weather Rules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Product Map */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Compass className="size-5 text-primary" />
                Active Season Product Mapping
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Products currently receiving seasonal scoring multipliers based on standard calendar quarters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Summer", "Monsoon", "Winter"].map((seasonName) => {
                const isActive = aiContext?.season?.season === seasonName;
                const products = 
                  seasonName === "Summer" 
                    ? ["Ice Cream", "Juice", "Water", "Curd"] 
                    : (seasonName === "Monsoon" ? ["Umbrella", "Tea", "Snacks"] : ["Coffee", "Tea", "Soup", "Blankets"]);

                return (
                  <div 
                    key={seasonName} 
                    className={`p-4 rounded-xl border transition-all ${
                      isActive 
                        ? "border-primary/45 bg-primary/5 shadow-sm" 
                        : "border-border/60 bg-secondary/10 opacity-70"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm text-foreground">{seasonName}</span>
                      {isActive && <Badge className="text-[8px] px-1.5 py-0">Active</Badge>}
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#94a3b8]">
                      {products.map((p) => (
                        <li key={p} className="flex items-center gap-1.5">
                          <ArrowRight className="size-3 text-primary shrink-0" />
                          <span className={isActive ? "text-foreground font-medium" : ""}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Correlations Chart */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-5 text-[#22c55e]" />
                Temperature vs. Category Sales Volume
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Historical correlation showing temperature peaks driving sales increases for cold categories.
              </p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CORRELATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} label={{ value: "Temp (°C)", angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} label={{ value: "Sales (units)", angle: 90, position: 'insideRight', style: { fill: '#64748b' } }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line yAxisId="left" name="Temperature" type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2} />
                  <Line yAxisId="right" name="Cold Category Sales" type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Side: AI recommendations & Weather Alerts */}
        <div className="space-y-6">
          {/* Weather Impact Rules */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-400" />
                Weather Impact Thresholds
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Automatic replenishment trigger multipliers based on rules.</p>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 space-y-1">
                <span className="font-bold text-rose-400">Extreme Heat (&gt;35°C)</span>
                <p className="text-[#94a3b8] text-[10px]">Triggers **+25%** demand spike on Ice Cream, Cold Drinks, Water.</p>
              </div>

              <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 space-y-1">
                <span className="font-bold text-blue-400">Heavy Rainfall (&gt;5mm)</span>
                <p className="text-[#94a3b8] text-[10px]">Triggers **+40%** demand spike on Umbrellas, Tea, Instant Noodles.</p>
              </div>

              <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 space-y-1">
                <span className="font-bold text-indigo-400">Winter Dip (&lt;20°C)</span>
                <p className="text-[#94a3b8] text-[10px]">Triggers **+18%** demand spike on Blankets, Coffee, Hot Soups.</p>
              </div>
            </div>
          </section>

          {/* AI Recommendations */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Brain className="size-5 text-[#22c55e]" />
                AI Replenishment Recommendations
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">Smart purchase orders suggested by model output targets.</p>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-secondary/15 border border-border/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-foreground">{rec.product}</span>
                    <Badge variant="outline" className="text-[9px] font-bold border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                      {rec.type}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[#94a3b8]">{rec.reason}</p>
                  <div className="text-[10px] text-foreground font-semibold flex items-center gap-1.5 pt-1 border-t border-border/10">
                    <ArrowRight className="size-3 text-[#22c55e] shrink-0" />
                    <span>Action: {rec.recommendation}</span>
                  </div>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-xs text-[#94a3b8] text-center py-4">No active weather suggestions today.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
