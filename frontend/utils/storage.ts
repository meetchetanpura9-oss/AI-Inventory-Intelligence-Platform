const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "current_user";

const isBrowser = () => typeof window !== "undefined";

export const storage = {
  get<T>(key: string): T | null {
    if (!isBrowser()) {
      return null;
    }

    const value = window.localStorage.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) {
      return;
    }

    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  },

  remove(key: string): void {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(key);
  },

  clearAuth(): void {
    this.remove(ACCESS_TOKEN_KEY);
    this.remove(REFRESH_TOKEN_KEY);
    this.remove(USER_KEY);
  },
};

export const getAccessToken = () => storage.get<string>(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string) => storage.set(ACCESS_TOKEN_KEY, token);
export const getRefreshToken = () => storage.get<string>(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string) => storage.set(REFRESH_TOKEN_KEY, token);
export const getStoredUser = <T>() => storage.get<T>(USER_KEY);
export const setStoredUser = <T>(user: T) => storage.set(USER_KEY, user);
export const clearAuthStorage = () => storage.clearAuth();
