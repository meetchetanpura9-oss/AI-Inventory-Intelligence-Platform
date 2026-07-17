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
import { salesService } from "../services/salesService";
import type { DateRangeFilter, ExportFormat, OrderStatus, PaymentStatus, Sale } from "../types";

interface ExportSalesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sales: Sale[];
  dateRange: DateRangeFilter;
  paymentStatus: "All" | PaymentStatus;
  orderStatus: "All" | OrderStatus;
}

export function ExportSalesDialog({
  isOpen,
  onClose,
  sales,
  dateRange,
  paymentStatus,
  orderStatus,
}: ExportSalesDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");

  const handleDownload = () => {
    salesService.exportSales(sales, format);
    toast.success(`Exported ${sales.length.toLocaleString()} sales`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Download className="size-5 text-primary" />
            Export Sales Report
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Download the current filtered sales view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 rounded-xl border border-border/50 bg-black/20 p-4 text-xs">
            <div className="flex justify-between gap-4">
              <span className="font-bold uppercase tracking-wider text-[#64748b]">Date Range</span>
              <span className="text-[#e2e8f0]">{dateRange}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-bold uppercase tracking-wider text-[#64748b]">Payment Status</span>
              <span className="text-[#e2e8f0]">{paymentStatus}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-bold uppercase tracking-wider text-[#64748b]">Order Status</span>
              <span className="text-[#e2e8f0]">{orderStatus}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Format
            </label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as ExportFormat)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>

        <DialogFooter className="border-border bg-transparent">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={sales.length === 0} className="gap-2">
            <Download className="size-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportSalesDialog;
