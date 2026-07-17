import React from "react";
import { toast } from "sonner";
import { Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "../types";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting = false,
}: DeleteUserDialogProps) {
  const handleDelete = async () => {
    if (!user) return;
    try {
      await onConfirm(user.id);
      toast.success(`User "${user.name}" deleted successfully.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to delete user.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#ef4444]">
            <Trash2 className="size-5" />
            Delete User?
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            This action cannot be undone. All data and authorization tokens linked to{" "}
            <span className="font-bold text-white">"{user?.name}"</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-[#ef4444] text-white hover:bg-[#ef4444]/90 gap-1.5 font-bold"
          >
            {isDeleting && <RefreshCw className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserDialog;
