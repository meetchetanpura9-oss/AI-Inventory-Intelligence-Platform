import { create } from "zustand";

import { authService } from "@/services/auth";
import type { CurrentUser, LoginRequest } from "@/types/auth";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from "@/utils/storage";

interface AuthStore {
  user: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  setUser: (user: CurrentUser | null) => void;
}

const initialAccessToken = getAccessToken();
const initialRefreshToken = getRefreshToken();
const initialUser = getStoredUser<CurrentUser>();

export const useAuthStore = create<AuthStore>((set) => ({
  user: initialUser,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialAccessToken && initialUser),
  isLoading: false,
  error: null,
  
  setUser(user) {
    set({ user, isAuthenticated: Boolean(user) });
  },

  async login(credentials) {
    set({ isLoading: true, error: null });

    try {
      const tokens = await authService.login(credentials);

      // Save tokens immediately
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);

      // Now this request includes the Bearer token
      const user = await authService.getCurrentUser();

      setStoredUser(user);

      set({
        user,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";

      clearAuthStorage();

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  async logout() {
    try {
      await authService.logout();
    } finally {
      clearAuthStorage(); // Clear all localStorage items on logout to prevent credential leakages
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
