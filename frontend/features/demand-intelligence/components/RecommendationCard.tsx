import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, Check } from "lucide-react";
import type { DemandRecommendation } from "../types";

export function RecommendationBadge({ type }: { type: "Reorder" | "Monitor" | "Overstock" | "Healthy" }) {
  if (type === "Reorder") {
    return (
      <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#3b82f6]" />
        Reorder
      </Badge>
    );
  }

  if (type === "Healthy") {
    return (
      <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#22c55e]" />
        Healthy
      </Badge>
    );
  }

  if (type === "Monitor") {
    return (
      <Badge className="bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#f97316]" />
        Monitor
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20 font-semibold text-xs py-0.5 px-2">
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#ef4444]" />
      Overstock
    </Badge>
  );
}

interface RecommendationCardProps {
  recommendation: DemandRecommendation;
  onApproveReorder?: (productId: number, suggestedQty: number) => void;
  isApproving?: boolean;
  approved?: boolean;
}

export function RecommendationCard({
  recommendation,
  onApproveReorder,
  isApproving = false,
  approved = false,
}: RecommendationCardProps) {
  const isUp = recommendation.expected_demand_change.startsWith("+");
  const percentVal = recommendation.expected_demand_change.replace(/[+-]/g, "");

  const handleAction = () => {
    if (onApproveReorder && recommendation.type === "Reorder") {
      // Extract quantity from description or use default
      const qtyMatch = recommendation.description.match(/(\d+)\s*units/i);
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 50;
      onApproveReorder(recommendation.product_id, qty);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute top-0 right-0 p-2">
        <Sparkles className="size-4 text-primary/30" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-foreground text-sm">
              {recommendation.product_name}
            </h4>
            <RecommendationBadge type={recommendation.type} />
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[28rem]">
            {recommendation.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="block text-[10px] text-[#94a3b8] font-medium uppercase tracking-wider">Proj. Trend</span>
          <span className={`text-sm font-bold flex items-center justify-end ${isUp ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
            {isUp ? <ArrowUpRight className="size-3.5 mr-0.5" /> : <ArrowDownRight className="size-3.5 mr-0.5" />}
            {percentVal}
          </span>
        </div>
      </div>

      {recommendation.type === "Reorder" && (
        <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-4">
          <Button
            size="sm"
            onClick={handleAction}
            disabled={isApproving || approved}
            className={`text-xs h-8 px-3 transition-all duration-200 ${
              approved 
                ? "bg-[#22c55e]/15 border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/15" 
                : "bg-primary text-primary-foreground hover:bg-primary/95"
            }`}
          >
            {isApproving ? (
              <RefreshCw className="size-3.5 animate-spin mr-1.5" />
            ) : approved ? (
              <Check className="size-3.5 mr-1.5" />
            ) : null}
            {approved ? "Reorder Raised" : "Approve Reorder"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RecommendationCard;
