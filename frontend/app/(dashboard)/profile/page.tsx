"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";

// Import Profile Feature Elements
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { PersonalInfoCard } from "@/features/profile/components/PersonalInfoCard";
import { AccountInfoCard } from "@/features/profile/components/AccountInfoCard";
import { SecurityCard } from "@/features/profile/components/SecurityCard";
import { ActivityCard } from "@/features/profile/components/ActivityCard";
import { EditProfileDialog } from "@/features/profile/components/EditProfileDialog";
import { ChangePasswordDialog } from "@/features/profile/components/ChangePasswordDialog";
import { AvatarUpload } from "@/features/profile/components/AvatarUpload";
import { LoadingSkeleton } from "@/features/profile/components/LoadingSkeleton";
import { ErrorState } from "@/features/profile/components/ErrorState";
import { EmptyState } from "@/features/profile/components/EmptyState";

export default function ProfilePage() {
  const {
    profile,
    activities,
    isLoading,
    isError,
    refetch,
    updateProfile,
    isUpdating,
    changePassword,
    isChangingPassword,
  } = useProfile();

  // Modals Open/Close States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Local state for Two-Factor Authentication
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("profile_2fa_enabled") === "true";
      setTwoFactorEnabled(stored);
    }
  }, []);

  const handleToggle2FA = (val: boolean) => {
    setTwoFactorEnabled(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_2fa_enabled", String(val));
    }
    toast.success(`Two-Factor Authentication (2FA) is now ${val ? "enabled" : "disabled"}.`);
  };

  const handleUpdateProfileDetails = async (data: { name: string; phone: string }) => {
    if (!profile) return;
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        avatar: profile.avatar,
      });
      refetch();
    } catch (err: any) {
      throw err;
    }
  };

  const handleSaveAvatar = async (avatarBase64?: string) => {
    if (!profile) return;
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        avatar: avatarBase64,
      });
      refetch();
    } catch (err: any) {
      throw err;
    }
  };

  const handleLogoutAllDevices = () => {
    if (confirm("Are you sure you want to log out all other active device sessions?")) {
      toast.success("Successfully logged out of all auxiliary device sessions.");
    }
  };

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (isLoading || !profile) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal details, visual identification cards, and security clearances."
      />

      {/* Profile Photo & Name header */}
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditOpen(true)}
        onAvatarUploadClick={() => setIsAvatarOpen(true)}
      />

      {/* Detail information layout grids */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact info and audit logs */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoCard profile={profile} />
          
          <ActivityCard activities={activities} />
        </div>

        {/* Security parameters & Credentials info */}
        <div className="lg:col-span-1 space-y-6">
          <AccountInfoCard profile={profile} />

          <SecurityCard
            profile={profile}
            twoFactorEnabled={twoFactorEnabled}
            onToggle2FA={handleToggle2FA}
            onChangePasswordClick={() => setIsPasswordOpen(true)}
            onLogoutAllClick={handleLogoutAllDevices}
          />
        </div>
      </div>

      {/* Edit Details Dialog Overlay */}
      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSubmit={handleUpdateProfileDetails}
        isUpdating={isUpdating}
      />

      {/* Avatar Image Upload Dialog Overlay */}
      <AvatarUpload
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        currentAvatar={profile.avatar}
        onSave={handleSaveAvatar}
        isSaving={isUpdating}
      />

      {/* Credentials Reset Dialog Overlay */}
      <ChangePasswordDialog
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSubmit={changePassword}
        isChanging={isChangingPassword}
      />
    </div>
  );
}
