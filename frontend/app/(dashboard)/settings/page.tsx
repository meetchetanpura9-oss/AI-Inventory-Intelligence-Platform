"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Laptop, 
  Save, 
  X, 
  RotateCcw,
  RefreshCw 
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import Settings Feature Components
import { useSettings } from "@/features/settings/hooks/useSettings";
import { settingsService } from "@/features/settings/services/settingsService";
import { GeneralCard } from "@/features/settings/components/GeneralCard";
import { AppearanceCard } from "@/features/settings/components/AppearanceCard";
import { LanguageCard } from "@/features/settings/components/LanguageCard";
import { NotificationCard } from "@/features/settings/components/NotificationCard";
import { SecurityCard } from "@/features/settings/components/SecurityCard";
import { BackupCard } from "@/features/settings/components/BackupCard";
import { SessionCard } from "@/features/settings/components/SessionCard";
import { LoadingSkeleton } from "@/features/settings/components/LoadingSkeleton";
import { ErrorState } from "@/features/settings/components/ErrorState";
import { EmptyState } from "@/features/settings/components/EmptyState";
import type { AppSettings, GeneralSettings, NotificationSettings } from "@/features/settings/types";

type SettingTab = "general" | "appearance" | "language" | "notifications" | "security" | "backup" | "sessions";

export default function SettingsPage() {
  const {
    settings,
    sessions,
    isLoading,
    isError,
    refetch,
    updateSettings,
    isUpdating,
    resetSettings,
    isResetting,
    importSettings,
    isImporting,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingTab>("general");
  const [editableSettings, setEditableSettings] = useState<AppSettings | null>(null);

  // Sync state with query data when loaded
  useEffect(() => {
    if (settings) {
      setEditableSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  // Adjust theme class on visual state changes
  useEffect(() => {
    if (editableSettings?.appearance?.theme) {
      const theme = editableSettings.appearance.theme;
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const matchesDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (matchesDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  }, [editableSettings?.appearance?.theme]);

  const handleGeneralChange = (key: keyof GeneralSettings, value: string) => {
    if (!editableSettings) return;
    setEditableSettings({
      ...editableSettings,
      general: {
        ...editableSettings.general,
        [key]: value,
      },
    });
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    if (!editableSettings) return;
    setEditableSettings({
      ...editableSettings,
      appearance: {
        ...editableSettings.appearance,
        theme,
      },
    });
  };

  const handleLanguageChange = (language: "en" | "hi" | "gu") => {
    if (!editableSettings) return;
    setEditableSettings({
      ...editableSettings,
      language: {
        ...editableSettings.language,
        language,
      },
    });
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    if (!editableSettings) return;
    setEditableSettings({
      ...editableSettings,
      notifications: {
        ...editableSettings.notifications,
        [key]: value,
      },
    });
  };

  const handleToggle2FA = (enabled: boolean) => {
    if (!editableSettings) return;
    setEditableSettings({
      ...editableSettings,
      security: {
        ...editableSettings.security,
        twoFactorEnabled: enabled,
      },
    });
    toast.success(`Two-Factor Authentication (2FA) is now ${enabled ? "enabled" : "disabled"}.`);
  };

  const handleChangePassword = () => {
    toast.info("Password change dialog triggered. Instructions sent to email.");
  };

  const handleLogoutAllDevices = () => {
    if (confirm("Are you sure you want to log out all other devices?")) {
      toast.success("Logged out of all other devices successfully.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableSettings) return;

    try {
      await updateSettings(editableSettings);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
    }
  };

  const handleCancel = () => {
    if (settings) {
      setEditableSettings(JSON.parse(JSON.stringify(settings)));
      toast.info("Changes discarded.");
    }
  };

  const handleResetToDefault = async () => {
    try {
      const defaults = await resetSettings();
      setEditableSettings(defaults);
    } catch {
      toast.error("Failed to restore default settings.");
    }
  };

  const handleImportSettings = async (fileContent: string) => {
    try {
      const imported = await importSettings(fileContent);
      setEditableSettings(imported);
    } catch (err: any) {
      throw err;
    }
  };

  const handleExportSettings = () => {
    if (editableSettings) {
      settingsService.exportSettings(editableSettings);
      toast.success("Settings exported successfully!");
    }
  };

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (isLoading || !editableSettings) {
    return <LoadingSkeleton />;
  }

  const tabs = [
    { id: "general" as const, label: "General", icon: SettingsIcon },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "language" as const, label: "Language", icon: Globe },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "backup" as const, label: "Backup & Restores", icon: Database },
    { id: "sessions" as const, label: "Active Sessions", icon: Laptop },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Settings"
        subtitle="Manage application configurations, warning parameters, and regional defaults."
      />

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Navigation Sidebar menu for desktop / scroll bar for mobile */}
        <aside className="w-full shrink-0 border border-border bg-card/20 rounded-2xl p-3 lg:w-64 select-none">
          <nav className="flex flex-row overflow-x-auto gap-1 lg:flex-col lg:overflow-x-visible" aria-label="Settings navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none w-full",
                    isActive
                      ? "bg-primary text-primary-foreground shadow shadow-primary/25"
                      : "text-[#94a3b8] hover:bg-muted hover:text-white"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Configurations workspace panel */}
        <div className="flex-1 w-full space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === "general" && (
              <GeneralCard values={editableSettings.general} onChange={handleGeneralChange} />
            )}

            {activeTab === "appearance" && (
              <AppearanceCard value={editableSettings.appearance.theme} onChange={handleThemeChange} />
            )}

            {activeTab === "language" && (
              <LanguageCard value={editableSettings.language.language} onChange={handleLanguageChange} />
            )}

            {activeTab === "notifications" && (
              <NotificationCard values={editableSettings.notifications} onChange={handleNotificationChange} />
            )}

            {activeTab === "security" && (
              <SecurityCard
                twoFactorEnabled={editableSettings.security.twoFactorEnabled}
                onToggle2FA={handleToggle2FA}
                onChangePassword={handleChangePassword}
                onLogoutAllDevices={handleLogoutAllDevices}
                isUpdating={isUpdating}
              />
            )}

            {activeTab === "backup" && (
              <BackupCard
                onExport={handleExportSettings}
                onImport={handleImportSettings}
                onReset={handleResetToDefault}
                isResetting={isResetting}
                isImporting={isImporting}
              />
            )}

            {activeTab === "sessions" && (
              <SessionCard sessions={sessions} />
            )}

            {/* Actions Footer Bar (Only display if not viewing read-only Sessions tab) */}
            {activeTab !== "sessions" && activeTab !== "backup" && (
              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4 select-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-10 border-border hover:bg-muted font-semibold text-xs px-4.5 gap-1.5"
                >
                  <X className="size-3.5" />
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-10 font-bold text-xs px-5 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95"
                >
                  {isUpdating ? (
                    <RefreshCw className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
