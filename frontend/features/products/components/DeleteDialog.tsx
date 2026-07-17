import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isDeleting,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Header alert icon */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ef4444]/10 text-[#ef4444]">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Product?</h3>
            <p className="text-xs text-[#94a3b8]">Are you sure you want to delete this catalog item?</p>
          </div>
        </div>

        {/* Content text */}
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-foreground leading-normal border border-border/40">
          This will permanently delete the product <strong className="text-white">{productName}</strong>.
          All sales histories, transactions, and safety stock records tied to this SKU will be lost. 
          This action is irreversible.
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted text-xs"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="gap-1.5 text-xs font-semibold bg-[#ef4444] hover:bg-[#ef4444]/90"
            disabled={isDeleting}
          >
            <Trash2 className="size-3.5" />
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default DeleteDialog;
