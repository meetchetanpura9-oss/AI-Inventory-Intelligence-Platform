import React, { useState } from "react";
import { toast } from "sonner";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  isCreating?: boolean;
}

export function CreateUserDialog({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
}: CreateUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Viewer");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Full name is required";
    
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      errs.email = "Invalid email format";
    }

    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{9,14}$/.test(phone.trim())) {
      errs.phone = "Invalid format (10-15 digits, e.g. +919876543210)";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
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
        name,
        email,
        phone,
        password,
        role,
      });
      toast.success("User registered successfully!");
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setRole("Viewer");
      setErrors({});
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to create user.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-lg select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <UserPlus className="size-5 text-primary" />
            Create New User Profile
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Add a new platform operator. Default self-registration role is Viewer.
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

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Email Address</label>
              <input
                type="text"
                placeholder="e.g. john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
              />
              {errors.email && <span className="text-[11px] text-[#ef4444] font-medium">{errors.email}</span>}
            </div>

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
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Password (Min 8 chars)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
              />
              {errors.password && <span className="text-[11px] text-[#ef4444] font-medium">{errors.password}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary transition"
              />
              {errors.confirmPassword && <span className="text-[11px] text-[#ef4444] font-medium">{errors.confirmPassword}</span>}
            </div>
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

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="gap-1.5 font-bold">
              {isCreating && <RefreshCw className="size-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserDialog;
