export interface GeneralSettings {
  organizationName: string;
  timeZone: string;
  currency: string;
  dateFormat: string;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
}

export interface LanguageSettings {
  language: "en" | "hi" | "gu";
}

export interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  lowStockAlerts: boolean;
  salesAlerts: boolean;
  purchaseAlerts: boolean;
  aiAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface SessionInfo {
  id: string;
  browser: string;
  os: string;
  loginTime: string;
  ipAddress: string;
  lastActivity: string;
}

export interface AppSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  language: LanguageSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}
