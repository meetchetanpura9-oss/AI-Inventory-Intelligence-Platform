import React, { useState } from "react";
import { toast } from "sonner";
import { KeyRound, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  isChanging?: boolean;
}

export function ChangePasswordDialog({
  isOpen,
  onClose,
  onSubmit,
  isChanging = false,
}: ChangePasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!oldPassword) {
      errs.oldPassword = "Current password is required";
    }

    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else {
      if (newPassword.length < 8) {
        errs.newPassword = "Password must be at least 8 characters long";
      }
      if (!/[A-Z]/.test(newPassword)) {
        errs.newPassword = "Must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(newPassword)) {
        errs.newPassword = "Must contain at least one lowercase letter";
      }
      if (!/\d/.test(newPassword)) {
        errs.newPassword = "Must contain at least one number";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        errs.newPassword = "Must contain at least one special character";
      }
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully!");
      // Reset state
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to update password.");
    }
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <KeyRound className="size-5 text-primary" />
            Update Password Credentials
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Ensure your account uses a secure, rotated password constraint.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.oldPassword && <span className="text-[11px] text-[#ef4444] font-medium">{errors.oldPassword}</span>}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.newPassword && <span className="text-[11px] text-[#ef4444] font-medium">{errors.newPassword}</span>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.confirmPassword && <span className="text-[11px] text-[#ef4444] font-medium">{errors.confirmPassword}</span>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={isChanging} className="gap-1.5 font-bold">
              {isChanging && <RefreshCw className="size-4 animate-spin" />}
              Update Credentials
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
