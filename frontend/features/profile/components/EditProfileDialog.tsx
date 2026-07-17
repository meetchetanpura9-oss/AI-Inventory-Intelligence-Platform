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
import type { UserProfile } from "../types";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSubmit: (data: { name: string; phone: string }) => Promise<any>;
  isUpdating?: boolean;
}

export function EditProfileDialog({
  isOpen,
  onClose,
  profile,
  onSubmit,
  isUpdating = false,
}: EditProfileDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setErrors({});
    }
  }, [profile]);

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
    if (!profile || !validate()) return;

    try {
      await onSubmit({
        name,
        phone,
      });
      toast.success("Profile details updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Edit2 className="size-5 text-primary" />
            Edit Profile details
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Update your personal contact details. Email and role clearances are locked.
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

          {/* Contact Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Phone Number</label>
            <input
              type="text"
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
            />
            {errors.phone && <span className="text-[11px] text-[#ef4444] font-medium">{errors.phone}</span>}
          </div>

          {/* Read Only Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Email Address (Locked)</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="h-10 rounded-lg border border-border bg-[#1e293b]/50 px-3 text-sm text-[#64748b] cursor-not-allowed select-none"
            />
          </div>

          {/* Read Only Role */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">System Clearance Role (Locked)</label>
            <input
              type="text"
              value={profile?.role || ""}
              disabled
              className="h-10 rounded-lg border border-border bg-[#1e293b]/50 px-3 text-sm text-[#64748b] cursor-not-allowed select-none capitalize"
            />
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

export default EditProfileDialog;
