import React, { useState, useEffect } from "react";
import { Search, RotateCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemandToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  selectedRecommendation: string;
  onRecommendationChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport: (format: "csv" | "excel" | "pdf") => void;
}

export function DemandToolbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  selectedRecommendation,
  onRecommendationChange,
  selectedCity,
  onCityChange,
  onRefresh,
  isRefreshing,
  onExport,
}: DemandToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Sync external search updates
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const categories = ["All", "Dairy", "Groceries", "Snacks", "Beverages"];
  const levels = ["All", "High", "Medium", "Low"];
  const recommendations = ["All", "Reorder", "Monitor", "Overstock", "Healthy"];
  const cities = ["All", "Delhi", "Mumbai", "Bangalore", "Pune"];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/25 p-5 shadow-sm backdrop-blur-md lg:flex-row lg:items-end lg:justify-between select-none">
      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 flex-1 max-w-6xl">
        {/* Search */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Search Product
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search product..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder-[#94a3b8] outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Demand Level */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Demand Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All Demand Levels" : `${l} Demand`}
              </option>
            ))}
          </select>
        </div>

        {/* Recommendation */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Recommendation
          </label>
          <select
            value={selectedRecommendation}
            onChange={(e) => onRecommendationChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {recommendations.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Recommendations" : r}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            City Location
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === "All" ? "Global Demand" : city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 lg:mt-0 shrink-0">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 border-border hover:bg-muted font-medium text-xs px-3.5 gap-1.5"
          title="Recalculate models"
        >
          <RotateCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Calculating..." : "Compute AI"}</span>
        </Button>

        <div className="flex items-center">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as any)}
            className="h-10 rounded-l-lg border-y border-l border-border bg-background px-2 text-xs text-foreground outline-none cursor-pointer hover:bg-muted/40 font-medium select-none"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <Button
            onClick={() => onExport(exportFormat)}
            className="h-10 rounded-r-lg rounded-l-none font-semibold text-xs px-3.5 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DemandToolbar;
