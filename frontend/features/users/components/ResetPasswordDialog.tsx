import React, { useState } from "react";
import { toast } from "sonner";
import { Key, Copy, Check, RefreshCw } from "lucide-react";
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

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (id: number) => Promise<any>;
  isResetting?: boolean;
}

export function ResetPasswordDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
  isResetting = false,
}: ResetPasswordDialogProps) {
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = async () => {
    if (!user) return;
    try {
      await onConfirm(user.id);
      // Generate a mock temporary password to show
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";
      const pass = Array.from({ length: 10 })
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
      const generatedPass = `Reset_${pass}`;

      setTempPassword(generatedPass);
      toast.success(`Password reset triggered for ${user.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to trigger reset.");
    }
  };

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast.success("Temporary password copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTempPassword(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Key className="size-5 text-[#14b8a6]" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            {tempPassword 
              ? "Copy and send this temporary password to the user. They must change it upon their next login."
              : `Trigger a secure credentials reset for user "${user?.name}".`
            }
          </DialogDescription>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Temporary Password</label>
              <div className="flex items-center gap-2 bg-black/30 border border-border rounded-lg p-3">
                <span className="font-mono text-sm text-foreground font-bold tracking-wide select-all flex-1">
                  {tempPassword}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-white/10 text-[#94a3b8] hover:text-white transition"
                  title="Copy password"
                >
                  {copied ? <Check className="size-4.5 text-[#22c55e]" /> : <Copy className="size-4.5" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#eab308] leading-relaxed">
              ⚠️ This password will not be shown again. Please copy it before closing the dialog.
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#e2e8f0] leading-relaxed py-2">
            Are you sure you want to reset password credentials for <span className="font-bold text-white">"{user?.name}"</span>?
          </p>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} className="border-border">
            {tempPassword ? "Close" : "Cancel"}
          </Button>
          {!tempPassword && (
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="bg-[#14b8a6] text-white hover:bg-[#14b8a6]/95 gap-1.5 font-bold"
            >
              {isResetting && <RefreshCw className="size-4 animate-spin" />}
              Generate Password
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPasswordDialog;
