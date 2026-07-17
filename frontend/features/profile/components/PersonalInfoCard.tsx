import React from "react";
import { User, Phone, Mail, Calendar, Briefcase } from "lucide-react";
import type { UserProfile } from "../types";

interface PersonalInfoCardProps {
  profile: UserProfile;
}

export function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Splitting full name safely for First/Last Name display
  const nameParts = profile.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "-";

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <User className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Personal Information</h3>
          <p className="text-[11px] text-[#94a3b8]">Contact credentials and operations hierarchy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* First Name */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">First Name</span>
          <span className="font-semibold text-white">{firstName}</span>
        </div>

        {/* Last Name */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">Last Name</span>
          <span className="font-semibold text-white">{lastName}</span>
        </div>

        {/* Email Address */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Mail className="size-3 text-[#64748b]" /> Email Address
          </span>
          <span className="font-semibold text-[#94a3b8] select-all">{profile.email}</span>
        </div>

        {/* Contact Phone */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Phone className="size-3 text-[#64748b]" /> Phone Number
          </span>
          <span className="font-semibold text-white">{profile.phone || "-"}</span>
        </div>

        {/* Joined Date */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Calendar className="size-3 text-[#64748b]" /> Date Joined
          </span>
          <span className="font-semibold text-white">{formatDate(profile.created_at)}</span>
        </div>

        {/* Department */}
        <div className="bg-card/30 border border-border/30 rounded-xl p-3 space-y-1">
          <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Briefcase className="size-3 text-[#64748b]" /> Department
          </span>
          <span className="font-semibold text-white">{profile.department || "Logistics Operations"}</span>
        </div>
      </div>
    </section>
  );
}

export default PersonalInfoCard;
