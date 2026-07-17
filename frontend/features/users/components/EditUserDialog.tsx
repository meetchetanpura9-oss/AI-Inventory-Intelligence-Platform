import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit2, RefreshCw } from "lucide-react";
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
import { mapBackendRoleToFrontend } from "../services/userService";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: { id: number; name: string; phone: string; role: string; status: string }) => Promise<any>;
  isUpdating?: boolean;
}

export function EditUserDialog({
  isOpen,
  onClose,
  user,
  onSubmit,
  isUpdating = false,
}: EditUserDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Viewer");
  const [status, setStatus] = useState("Active");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with selected user
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setRole(mapBackendRoleToFrontend(user.role));
      setStatus(user.status);
      setErrors({});
    }
  }, [user]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Full name is required";
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{9,14}$/.test(phone.trim())) {
      errs.phone = "Invalid format (e.g. +919876543210)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    try {
      await onSubmit({
        id: user.id,
        name,
        phone,
        role,
        status,
      });
      toast.success("User details updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to update user details.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Edit2 className="size-5 text-primary" />
            Modify User Details
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Update operator credentials or role clearance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.name && <span className="text-[11px] text-[#ef4444] font-medium">{errors.name}</span>}
          </div>

          {/* Phone (E.164) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Phone (E.164)</label>
            <input
              type="text"
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.phone && <span className="text-[11px] text-[#ef4444] font-medium">{errors.phone}</span>}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Platform Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="Viewer">Viewer (Read Only)</option>
              <option value="Staff">Staff (Operations)</option>
              <option value="Manager">Manager (Administration)</option>
              <option value="Admin">Admin (Full Access)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="Active">🟢 Active</option>
              <option value="Inactive">🔴 Inactive</option>
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="gap-1.5 font-bold">
              {isUpdating && <RefreshCw className="size-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
