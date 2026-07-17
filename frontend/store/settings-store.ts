import { create } from "zustand";

interface SettingsState {
  currency: string;
  theme: "light" | "dark" | "system";
  lowStockAlert: boolean;
  emailDigest: boolean;
  criticalThreshold: number;
  warningThreshold: number;
  language: string;
  setCurrency: (currency: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLowStockAlert: (enabled: boolean) => void;
  setEmailDigest: (enabled: boolean) => void;
  setThresholds: (critical: number, warning: number) => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => {
  // Safe parsing of localStorage
  const getStored = <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  };

  return {
    currency: getStored("currency", "INR"),
    theme: getStored("theme", "dark") as "light" | "dark" | "system",
    lowStockAlert: getStored("lowStockAlert", true),
    emailDigest: getStored("emailDigest", false),
    criticalThreshold: getStored("criticalThreshold", 10),
    warningThreshold: getStored("warningThreshold", 25),
    language: getStored("language", "en"),

    setCurrency: (currency) => {
      localStorage.setItem("currency", JSON.stringify(currency));
      set({ currency });
    },
    setTheme: (theme) => {
      localStorage.setItem("theme", theme); // note: theme is stored raw in root script
      const doc = document.documentElement;
      if (theme === "dark") {
        doc.classList.add("dark");
        doc.classList.remove("light");
      } else if (theme === "light") {
        doc.classList.add("light");
        doc.classList.remove("dark");
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) {
          doc.classList.add("dark");
          doc.classList.remove("light");
        } else {
          doc.classList.add("light");
          doc.classList.remove("dark");
        }
      }
      set({ theme });
    },
    setLowStockAlert: (enabled) => {
      localStorage.setItem("lowStockAlert", JSON.stringify(enabled));
      set({ lowStockAlert: enabled });
    },
    setEmailDigest: (enabled) => {
      localStorage.setItem("emailDigest", JSON.stringify(enabled));
      set({ emailDigest: enabled });
    },
    setThresholds: (critical, warning) => {
      localStorage.setItem("criticalThreshold", JSON.stringify(critical));
      localStorage.setItem("warningThreshold", JSON.stringify(warning));
      set({ criticalThreshold: critical, warningThreshold: warning });
    },
    setLanguage: (lang) => {
      localStorage.setItem("language", JSON.stringify(lang));
      set({ language: lang });
    },
  };
});
