"use client";

import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, error, login, logout } = useAuthStore();

  return {
    user,
    token: accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
export default useAuth;
