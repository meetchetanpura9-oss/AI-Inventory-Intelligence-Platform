export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  PRODUCTS: "/products",
  INVENTORY: "/inventory",
  SALES: "/sales",
  PURCHASES: "/purchase",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REQUEST_ACCESS: "/auth/request-access",
  },
} as const;
