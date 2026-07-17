import React from "react";
import { Edit2, Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../types";
import { UserRoleBadge } from "@/features/users/components/UserRoleBadge";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
  onAvatarUploadClick: () => void;
}

export function ProfileHeader({
  profile,
  onEditClick,
  onAvatarUploadClick,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-xl select-none">
      {/* Decorative Gradient Banner */}
      <div className="h-32 w-full bg-gradient-to-r from-primary/30 via-[#3b82f6]/20 to-[#14b8a6]/20" />

      {/* Profile Details Bar */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between px-6 pb-6 -mt-10 gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
          {/* Avatar frame */}
          <div className="relative group size-24 rounded-full border-4 border-[#0f172a] shadow-lg overflow-hidden bg-gradient-to-tr from-[#3b82f6]/10 to-[#14b8a6]/10">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center font-bold text-2xl text-primary">
                {getInitials(profile.name)}
              </div>
            )}
            
            {/* Upload Overlay trigger */}
            <button
              onClick={onAvatarUploadClick}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
            >
              <Camera className="size-5 mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-white leading-snug">{profile.name}</h2>
              <UserRoleBadge role={profile.role} />
            </div>
            <p className="text-xs text-[#94a3b8] font-mono select-all">{profile.email}</p>
            
            <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <span className="relative flex size-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onEditClick}
          className="h-10 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 shrink-0 px-4.5"
        >
          <Edit2 className="size-3.5" />
          <span>Edit Profile</span>
        </Button>
      </div>
    </div>
  );
}

export default ProfileHeader;
