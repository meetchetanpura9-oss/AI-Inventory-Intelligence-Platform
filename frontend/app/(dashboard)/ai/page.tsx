"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  RefreshCw,
  Database,
  Package,
  Warehouse,
  MapPin,
  Globe,
  HardDrive,
  Calendar,
  Layers,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIDatasetTable } from "@/features/ai/components/AIDatasetTable";
import { useAIDataset } from "@/features/ai/hooks/useAIDataset";
import { useAIDatasetSummary } from "@/features/ai/hooks/useAIDatasetSummary";
import { useAIPipelineStatus } from "@/features/ai/hooks/useAIPipelineStatus";
import { useAIFeatures } from "@/features/ai/hooks/useAIFeatures";
import { aiDatasetService } from "@/features/ai/services/aiDatasetService";
import type { DatasetValidationResponse, PreprocessResponse, TrainTestSplitResponse } from "@/features/ai/types";

const PAGE_SIZE = 10;

export default function AIPage() {
  const [offset, setOffset] = useState(0);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  // Operation States
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<DatasetValidationResponse | null>(null);

  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [preprocessResult, setPreprocessResult] = useState<PreprocessResponse | null>(null);

  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResult, setSplitResult] = useState<TrainTestSplitResponse | null>(null);

  // Queries
  const { 
    data, 
    isLoading, 
    isError, 
    refetch, 
    isFetching 
  } = useAIDataset(PAGE_SIZE, offset);

  const { 
    data: summaryData, 
    refetch: refetchSummary 
  } = useAIDatasetSummary();

  const { 
    data: pipelineData, 
    isLoading: isPipelineLoading,
    isError: isPipelineError,
    refetch: refetchPipeline,
    isFetching: isPipelineFetching
  } = useAIPipelineStatus();

  const { 
    data: featuresData,
    isLoading: isFeaturesLoading,
    refetch: refetchFeatures
  } = useAIFeatures();

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  const handleExport = async () => {
    try {
      await aiDatasetService.exportCsv();
      toast.success("AI training dataset CSV export started.");
    } catch {
      toast.error("Unable to export AI dataset.");
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await aiDatasetService.validate();
      setValidationResult(res);
      refetchPipeline();
      toast.success("Dataset integrity & validation checks completed.");
    } catch {
      toast.error("Failed to validate dataset.");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePreprocess = async () => {
    setIsPreprocessing(true);
    try {
      const res = await aiDatasetService.preprocess();
      setPreprocessResult(res);
      // Automatically clear split status to sync steps
      setSplitResult(null);
      refetchPipeline();
      refetchSummary();
      refetch();
      toast.success("Data cleaning, encoding, scaling, and features generated successfully!");
    } catch {
      toast.error("Failed to run preprocessing pipeline.");
    } finally {
      setIsPreprocessing(false);
    }
  };

  const handleSplit = async () => {
    setIsSplitting(true);
    try {
      const res = await aiDatasetService.trainTestSplit(0.2, 0.0); // 80% train, 20% test
      setSplitResult(res);
      refetchPipeline();
      toast.success("Data split computed (80% Train / 20% Test).");
    } catch {
      toast.error("Failed to perform Train/Test split.");
    } finally {
      setIsSplitting(false);
    }
  };

  const formatDateMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const formatBytes = (mb: number) => {
    if (!mb) return "0 Bytes";
    let bytes = mb * 1024 * 1024;
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatStatusText = (status: string) => {
    if (!status) return "READY";
    const upper = status.toUpperCase();
    if (upper === "PREPROCESSED") return "READY FOR TRAINING";
    return upper.replaceAll("_", " ");
  };

  const handleRefreshAll = () => {
    refetch();
    refetchSummary();
    refetchPipeline();
    refetchFeatures();
  };

  if (isError || isPipelineError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center">
        <AlertTriangle className="size-12 text-rose-400" />
        <h2 className="mt-4 text-lg font-bold text-foreground">Unable to load AI Data Pipeline</h2>
        <p className="mt-2 text-sm text-[#94a3b8]">The AI dataset or pipeline APIs are currently unavailable.</p>
        <Button onClick={handleRefreshAll} size="sm" className="mt-4 gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Determine Badge Color for Step status
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DONE":
        return <Badge className="border-[#22c55e]/25 bg-[#22c55e]/10 text-[#22c55e]">DONE</Badge>;
      case "READY":
        return <Badge className="border-[#3b82f6]/25 bg-[#3b82f6]/10 text-[#3b82f6]">READY</Badge>;
      case "PENDING":
      default:
        return <Badge variant="outline" className="text-[#64748b] border-border">PENDING</Badge>;
    }
  };

  const totalRows = pipelineData?.dataset_rows || 0;
  const isPipelineProcessed = pipelineData?.status === "PREPROCESSED";

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="AI Data Pipeline Dashboard"
        subtitle="End-to-end Machine Learning data engineering, cleaning, feature engineering, and validation workspace."
        action={
          <div className="flex gap-2">
            <Button 
              onClick={handleRefreshAll} 
              size="sm" 
              variant="outline" 
              className="gap-2" 
              disabled={isFetching || isPipelineFetching}
            >
              <RefreshCw className={`size-4 ${isFetching || isPipelineFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleExport} size="sm" className="gap-2">
              <Download className="size-4" />
              Export Dataset
            </Button>
          </div>
        }
      />

      {/* Pipeline Status Steps & Actions Panel */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/Middle: Pipeline Flow Visualizer */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="size-5 text-primary" />
              AI Preprocessing Pipeline Flow
            </h2>
            <Badge variant={isPipelineProcessed ? "default" : "secondary"}>
              {formatStatusText(pipelineData?.status || "READY")}
            </Badge>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 md:px-2">
            {isPipelineLoading ? (
              <div className="h-16 w-full animate-pulse bg-muted rounded-lg" />
            ) : (
              pipelineData?.steps.map((step, idx) => (
                <div key={step.name} className="flex flex-1 items-center gap-3 relative z-10">
                  <div className="flex flex-col items-start gap-1 p-3 bg-secondary/20 rounded-xl border border-border/50 w-full">
                    <span className="text-[10px] font-bold text-[#64748b]">Step {idx + 1}</span>
                    <span className="text-xs font-semibold text-foreground">{step.name}</span>
                    <div className="mt-1">{getStatusBadge(step.status)}</div>
                  </div>
                  {idx < pipelineData.steps.length - 1 && (
                    <ArrowRight className="hidden md:block size-4 text-[#475569] shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Actions Control Center */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Pipeline Operations
            </h2>
            <p className="mt-1 text-xs text-[#94a3b8]">Run backend data engineering commands to build training structures.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleValidate} 
              disabled={isValidating || isPreprocessing || isSplitting} 
              variant="outline"
              className="justify-start gap-3 w-full"
            >
              <ShieldCheck className={`size-4 ${isValidating ? "animate-spin text-primary" : "text-[#22c55e]"}`} />
              {isValidating ? "Validating..." : "Validate Dataset"}
            </Button>
            
            <Button 
              onClick={handlePreprocess} 
              disabled={isValidating || isPreprocessing || isSplitting} 
              variant="outline"
              className="justify-start gap-3 w-full"
            >
              <Cpu className={`size-4 ${isPreprocessing ? "animate-spin text-primary" : "text-sky-400"}`} />
              {isPreprocessing ? "Preprocessing..." : "Clean & Preprocess Data"}
            </Button>

            <Button 
              onClick={handleSplit} 
              disabled={isValidating || isPreprocessing || isSplitting} 
              variant="outline"
              className="justify-start gap-3 w-full"
            >
              <GitBranch className={`size-4 ${isSplitting ? "animate-spin text-primary" : "text-amber-400"}`} />
              {isSplitting ? "Splitting..." : "Train/Test Split (80/20)"}
            </Button>
          </div>
        </div>
      </section>

      {/* Metadata Metrics Grid */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {[
          { label: "Dataset Size", value: summaryData ? formatBytes(summaryData.dataset_size_mb) : "-", icon: HardDrive },
          { label: "Total Rows", value: totalRows.toLocaleString(), icon: Database },
          { 
            label: "Train Size", 
            value: splitResult 
              ? `${splitResult.train_size.toLocaleString()} (${Math.round(splitResult.train_ratio * 100)}%)` 
              : (isPipelineProcessed 
                  ? `${Math.round(totalRows * 0.8).toLocaleString()} (80%)` 
                  : "0 (80% pending)"), 
            icon: GitBranch 
          },
          { 
            label: "Test Size", 
            value: splitResult 
              ? `${splitResult.test_size.toLocaleString()} (${Math.round(splitResult.test_ratio * 100)}%)` 
              : (isPipelineProcessed 
                  ? `${Math.round(totalRows * 0.2).toLocaleString()} (20%)` 
                  : "0 (20% pending)"), 
            icon: GitBranch 
          },
          { 
            label: "Columns", 
            value: preprocessResult ? preprocessResult.columns_processed : (data?.summary.columns.length || "-"), 
            icon: Layers 
          },
          { 
            label: "Missing Values", 
            value: validationResult 
              ? validationResult.missing_values 
              : (preprocessResult 
                  ? preprocessResult.missing_values_after 
                  : (summaryData ? summaryData.missing_values : 0)), 
            icon: AlertTriangle,
            warning: (validationResult && validationResult.missing_values > 0) || (summaryData && summaryData.missing_values > 0)
          },
          { 
            label: "Duplicates", 
            value: validationResult 
              ? validationResult.duplicate_rows 
              : (preprocessResult 
                  ? preprocessResult.duplicates_removed 
                  : (data ? data.summary.duplicate_records_removed : 0)), 
            icon: Database,
            warning: (validationResult && validationResult.duplicate_rows > 0) || (data && data.summary.duplicate_records_removed > 0)
          },
          { label: "Selected Features", value: featuresData?.feature_count || "-", icon: Cpu },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <section key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748b]">{card.label}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-lg font-extrabold ${card.warning ? "text-amber-400" : "text-foreground"}`}>
                  {card.value}
                </span>
                <Icon className={`size-4 ${card.warning ? "text-amber-400" : "text-primary/70"}`} />
              </div>
            </section>
          );
        })}
      </section>

      {/* Dataset Quality Report */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="size-5 text-[#22c55e]" />
          Dataset Quality Report
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2 bg-secondary/10 p-3.5 rounded-xl border border-border/40">
            <div className="flex items-center gap-2 text-[#22c55e] font-semibold text-sm">
              <CheckCircle2 className="size-4" />
              <span>Dataset Loaded Successfully</span>
            </div>
            <div className="text-[#94a3b8] mt-2 space-y-1.5">
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span>Rows Processed:</span>
                <span className="text-foreground font-bold">{preprocessResult ? preprocessResult.rows_processed : (summaryData ? summaryData.total_rows : 0)}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span>Duplicates Removed:</span>
                <span className="text-foreground font-semibold">{preprocessResult ? preprocessResult.duplicates_removed : (data ? data.summary.duplicate_records_removed : 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Missing Optional Values:</span>
                <span className="text-foreground font-semibold">{validationResult ? validationResult.missing_values : (preprocessResult ? preprocessResult.missing_values_after : (summaryData ? summaryData.missing_values : 0))}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-secondary/10 p-3.5 rounded-xl border border-border/40">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Cpu className="size-4" />
              <span>ML Input Features & Pipeline</span>
            </div>
            <div className="text-[#94a3b8] mt-2 space-y-1.5">
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span>Low Demand Products:</span>
                <span className="text-foreground font-semibold">{data ? data.items.filter(item => item.demand_score < 40).length : 0}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span>Feature Columns:</span>
                <span className="text-foreground font-bold">{featuresData ? featuresData.feature_count : 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pipeline Transformations:</span>
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <span className={preprocessResult || isPipelineProcessed ? "text-[#22c55e]" : "text-[#64748b]"}>Encoding</span>
                  <span className="text-border">|</span>
                  <span className={preprocessResult || isPipelineProcessed ? "text-[#22c55e]" : "text-[#64748b]"}>Scaling</span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-secondary/10 p-3.5 rounded-xl border border-border/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <GitBranch className="size-4 text-primary" />
                <span>Pipeline Status</span>
              </div>
              <p className="mt-2 text-[#94a3b8]">
                Last execution status: <strong className="text-foreground">{formatStatusText(pipelineData?.status || "READY")}</strong>
              </p>
            </div>
            <div className="mt-3">
              {pipelineData?.status === "PREPROCESSED" || preprocessResult ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" /> Ready for Training
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-200 border border-amber-400/20 inline-flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" /> Preprocessing Required
                </span>
              )}
            </div>
          </div>
        </div>

        {validationResult && validationResult.issues.length > 0 && (
          <div className="p-3 rounded-lg border border-amber-400/20 bg-amber-400/5 space-y-1">
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="size-3.5" />
              <span>Integrity Logs & Validation Issues ({validationResult.issues.length}):</span>
            </div>
            <ul className="text-[10px] text-[#94a3b8] list-disc list-inside max-h-24 overflow-y-auto space-y-0.5">
              {validationResult.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Collapsible Features Details */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <button 
          onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-foreground hover:bg-secondary/10 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <Cpu className="size-4 text-primary" />
            ML Preprocessing & Feature Selection Details
          </span>
          {isFeaturesOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {isFeaturesOpen && (
          <div className="border-t border-border p-4 space-y-4 text-xs">
            {isFeaturesLoading ? (
              <div className="h-20 animate-pulse bg-muted rounded-lg" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Selected ML Input Features ({featuresData?.feature_count})</h4>
                  <div className="flex flex-wrap gap-1">
                    {featuresData?.selected_features.map((feat) => (
                      <Badge key={feat} variant="secondary" className="text-[10px] py-0.5 px-2 bg-secondary/35 border-none">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-rose-400">Removed / Untracked Columns ({featuresData?.removed_features.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {featuresData?.removed_features.map((feat) => (
                      <Badge key={feat} className="text-[10px] py-0.5 px-2 border-rose-500/25 bg-rose-500/10 text-rose-300">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {preprocessResult && (
              <div className="border-t border-border/60 pt-4 space-y-2">
                <h4 className="font-bold text-[#22c55e]">Pipeline Run Summary Statistics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-[#94a3b8]">
                  <div>
                    <span>Processed Rows: </span>
                    <strong className="text-foreground">{preprocessResult.rows_processed}</strong>
                  </div>
                  <div>
                    <span>Encoded Columns: </span>
                    <strong className="text-foreground">{preprocessResult.encoded_columns.length} columns</strong>
                  </div>
                  <div>
                    <span>Scaled Columns: </span>
                    <strong className="text-foreground">{preprocessResult.scaled_columns.length} columns</strong>
                  </div>
                  <div>
                    <span>Duplicates Cleaned: </span>
                    <strong className="text-foreground">{preprocessResult.duplicates_removed} duplicates</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Dataset Table Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">AI-Ready Dataset Rows</h2>
          <p className="text-xs text-[#94a3b8]">Page {page} of {totalPages}</p>
        </div>
        {isLoading || !data ? (
          <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
        ) : (
          <>
            <AIDatasetTable rows={data.items} />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={offset + PAGE_SIZE >= data.total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
