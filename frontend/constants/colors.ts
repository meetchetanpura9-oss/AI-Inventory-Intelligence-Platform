export const COLORS = {
  background: "#07111f",
  card: "#102235",
  primary: "#3b82f6",
  secondary: "#14b8a6",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  border: "#223046",
} as const;

export const BRAND = {
  name: "AI Inventory Intelligence Platform",
  tagline: "Smarter Inventory. Better Decisions.",
  shortTagline: "AI-Powered Inventory Intelligence",
} as const;

export type BrandColor = keyof typeof COLORS;
