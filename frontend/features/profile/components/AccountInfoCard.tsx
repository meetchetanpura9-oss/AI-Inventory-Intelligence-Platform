import React from "react";
import { ShieldAlert, Fingerprint, Calendar, Clock, Key } from "lucide-react";
import type { UserProfile } from "../types";
import { UserRoleBadge } from "@/features/users/components/UserRoleBadge";
import { UserStatusBadge } from "@/features/users/components/UserStatusBadge";

interface AccountInfoCardProps {
  profile: UserProfile;
}

export function AccountInfoCard({ profile }: AccountInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <ShieldAlert className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Account Details</h3>
          <p className="text-[11px] text-[#94a3b8]">Security hierarchy and system access logs</p>
        </div>
      </div>

      <div className="divide-y divide-border/30 text-xs">
        {/* User ID */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <Fingerprint className="size-3.5 text-[#64748b]" /> User ID Key
          </span>
          <span className="font-semibold text-white select-all font-mono">UID-{profile.id}</span>
        </div>

        {/* Role Badge */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-[#64748b]" /> Clearance Role
          </span>
          <UserRoleBadge role={profile.role} />
        </div>

        {/* Account Status */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-[#64748b]" /> Verification Status
          </span>
          <UserStatusBadge status={profile.status} />
        </div>

        {/* Created Date */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <Calendar className="size-3.5 text-[#64748b]" /> Registered On
          </span>
          <span className="font-semibold text-white">{formatDate(profile.created_at)}</span>
        </div>

        {/* Last Login */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <Clock className="size-3.5 text-[#64748b]" /> Last Logged In
          </span>
          <span className="font-semibold text-white">{formatDate(profile.last_login)}</span>
        </div>

        {/* Last Password Change */}
        <div className="flex items-center justify-between py-3 bg-card/10">
          <span className="text-[#94a3b8] flex items-center gap-2">
            <Key className="size-3.5 text-[#64748b]" /> Password Rotated
          </span>
          <span className="font-semibold text-white">{formatDate(profile.last_password_change)}</span>
        </div>
      </div>
    </section>
  );
}

export default AccountInfoCard;
