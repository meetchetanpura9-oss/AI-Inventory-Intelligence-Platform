import React, { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { analyticsService } from "../services/analyticsService";
import type { AnalyticsDashboard, ExportFormat } from "../types";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: AnalyticsDashboard;
}

export function ExportDialog({ isOpen, onClose, dashboard }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");

  const handleExport = () => {
    analyticsService.exportDashboard(dashboard, format);
    toast.success("Dashboard export started");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Download className="size-5 text-primary" />
            Export Dashboard
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">Download KPI and dashboard summary data.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Format</label>
          <select value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary">
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <DialogFooter className="border-border bg-transparent">
          <Button variant="outline" onClick={onClose} className="border-border">Cancel</Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDialog;
