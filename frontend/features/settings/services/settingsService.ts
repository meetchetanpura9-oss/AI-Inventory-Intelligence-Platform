import type { AppSettings, SessionInfo } from "../types";

const LOCAL_STORAGE_KEY = "ai_inventory_settings_v1";

const DEFAULT_SETTINGS: AppSettings = {
  general: {
    organizationName: "AI Inventory Platform",
    timeZone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
  },
  appearance: {
    theme: "dark",
  },
  language: {
    language: "en",
  },
  notifications: {
    emailNotifications: true,
    browserNotifications: true,
    lowStockAlerts: true,
    salesAlerts: true,
    purchaseAlerts: false,
    aiAlerts: true,
  },
  security: {
    twoFactorEnabled: false,
  }
};

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(settings: AppSettings): Promise<AppSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }
    return settings;
  },

  async updateTheme(theme: "light" | "dark" | "system"): Promise<AppSettings> {
    const current = await this.getSettings();
    current.appearance.theme = theme;
    return this.updateSettings(current);
  },

  async updateLanguage(language: "en" | "hi" | "gu"): Promise<AppSettings> {
    const current = await this.getSettings();
    current.language.language = language;
    return this.updateSettings(current);
  },

  async updateNotifications(notifications: Partial<AppSettings["notifications"]>): Promise<AppSettings> {
    const current = await this.getSettings();
    current.notifications = { ...current.notifications, ...notifications };
    return this.updateSettings(current);
  },

  async updateSecurity(security: Partial<AppSettings["security"]>): Promise<AppSettings> {
    const current = await this.getSettings();
    current.security = { ...current.security, ...security };
    return this.updateSettings(current);
  },

  async getSessionInfo(): Promise<SessionInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      {
        id: "sess-1",
        browser: "Chrome",
        os: "Windows 11",
        loginTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        ipAddress: "192.168.1.10",
        lastActivity: new Date(Date.now() - 1000 * 60).toISOString(),
      },
      {
        id: "sess-2",
        browser: "Safari",
        os: "iOS 17",
        loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        ipAddress: "172.56.21.90",
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      }
    ];
  },

  exportSettings(settings: AppSettings) {
    if (typeof window === "undefined") return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ai_inventory_settings_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  },

  async importSettings(fileContent: string): Promise<AppSettings> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const imported = JSON.parse(fileContent);
    if (!imported.general || !imported.appearance || !imported.language || !imported.notifications) {
      throw new Error("Invalid settings file structure.");
    }
    return this.updateSettings(imported);
  },

  async resetSettings(): Promise<AppSettings> {
    return this.updateSettings(DEFAULT_SETTINGS);
  }
};
export default settingsService;
