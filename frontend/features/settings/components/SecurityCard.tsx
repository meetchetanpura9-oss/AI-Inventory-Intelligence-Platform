import React from "react";
import { Shield, Key, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityCardProps {
  twoFactorEnabled: boolean;
  onToggle2FA: (enabled: boolean) => void;
  onChangePassword: () => void;
  onLogoutAllDevices: () => void;
  isUpdating?: boolean;
}

export function SecurityCard({
  twoFactorEnabled,
  onToggle2FA,
  onChangePassword,
  onLogoutAllDevices,
  isUpdating = false,
}: SecurityCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-5">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Shield className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Security Credentials</h3>
          <p className="text-[11px] text-[#94a3b8]">Manage password resets, active device sessions, and 2FA</p>
        </div>
      </div>

      <div className="divide-y divide-border/30 space-y-4">
        {/* Two-Factor Auth Toggle */}
        <div className="flex items-center justify-between pb-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</p>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed max-w-[28rem]">
              Add a layer of security by requiring a verification code from an authenticator app.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onToggle2FA(!twoFactorEnabled)}
            className={`text-xs h-8 px-3 font-bold shrink-0 ${
              twoFactorEnabled 
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/15" 
                : "bg-primary text-primary-foreground hover:bg-primary/95"
            }`}
          >
            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div>

        {/* Change Password */}
        <div className="flex items-center justify-between py-3.5 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">Change Account Password</p>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed max-w-[28rem]">
              Regularly update your login password to ensure security clearance boundaries.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onChangePassword}
            className="text-xs h-8 border-border hover:bg-muted font-semibold gap-1.5 shrink-0"
          >
            <Key className="size-3.5" />
            <span>Change Password</span>
          </Button>
        </div>

        {/* Active Sessions Logout */}
        <div className="flex items-center justify-between pt-3.5 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">Device Authorizations</p>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed max-w-[28rem]">
              Log out of all active web and mobile device sessions except this current browser window.
            </p>
          </div>
          <Button
            size="sm"
            onClick={onLogoutAllDevices}
            className="text-xs h-8 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold gap-1.5 shrink-0"
          >
            <LogOut className="size-3.5" />
            <span>Logout All Devices</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SecurityCard;
