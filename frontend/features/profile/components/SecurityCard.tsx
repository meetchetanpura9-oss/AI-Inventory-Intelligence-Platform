import React from "react";
import { Shield, KeyRound, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../types";

interface SecurityCardProps {
  profile: UserProfile;
  twoFactorEnabled: boolean;
  onToggle2FA: (enabled: boolean) => void;
  onChangePasswordClick: () => void;
  onLogoutAllClick: () => void;
}

export function SecurityCard({
  profile,
  twoFactorEnabled,
  onToggle2FA,
  onChangePasswordClick,
  onLogoutAllClick,
}: SecurityCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Shield className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Security Clearance</h3>
          <p className="text-[11px] text-[#94a3b8]">Configure account verification and password rotation</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Two-Factor Authentication status */}
        <div className="flex items-center justify-between gap-4 bg-card/30 border border-border/30 rounded-xl p-3.5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white block">Two-Factor Authentication</span>
            <span className="text-[10px] text-[#94a3b8] block max-w-xs">
              Secure authentication layer using mobile authenticator OTP codes.
            </span>
          </div>
          <button
            onClick={() => onToggle2FA(!twoFactorEnabled)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              twoFactorEnabled
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                : "bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            }`}
          >
            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>

        {/* Change password button */}
        <div className="flex items-center justify-between gap-4 bg-card/30 border border-border/30 rounded-xl p-3.5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white block">Access Password</span>
            <span className="text-[10px] text-[#94a3b8] block">
              Last rotated: <span className="font-semibold text-white">{formatDate(profile.last_password_change)}</span>
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onChangePasswordClick}
            className="h-8.5 text-xs border-border hover:bg-muted font-semibold gap-1.5 shrink-0"
          >
            <KeyRound className="size-3.5" />
            <span>Change Password</span>
          </Button>
        </div>

        {/* Logout all devices */}
        <div className="flex items-center justify-between gap-4 bg-card/30 border border-border/30 rounded-xl p-3.5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white block">Session Clearance</span>
            <span className="text-[10px] text-[#94a3b8] block">
              Invalidate token signatures across all auxiliary browsers.
            </span>
          </div>
          <Button
            size="sm"
            onClick={onLogoutAllClick}
            className="h-8.5 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold gap-1.5 shrink-0"
          >
            <LogOut className="size-3.5" />
            <span>Logout Devices</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SecurityCard;
