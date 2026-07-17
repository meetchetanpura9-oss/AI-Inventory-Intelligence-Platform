import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { API } from "@/constants/api";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import type { TokenResponse } from "@/types/auth";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/storage";

const API_BASE_URL = API.BASE_URL;
const API_TIMEOUT_MS = 15000;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Guard variables to queue concurrent requests while a single token refresh is active.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
}> = [];

// Resolve or reject all queued requests depending on the refresh operation outcome.
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Intercept outgoing requests to attach correlation IDs, credentials, and timestamps.
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  // Attach jwt token if available.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Correlation ID helps trace a single request's lifecycle on the backend logs.
  const requestId = Math.random().toString(36).substring(2, 15);
  config.headers["X-Request-ID"] = requestId;

  // Track start time to measure exact latency of the call in the response interceptor.
  config.headers["X-Request-Start-Time"] = String(Date.now());

  return config;
});

// Intercept incoming responses to measure metrics, logs, and capture unauthorized 401 signals.
api.interceptors.response.use(
  (response) => {
    const config = response.config;
    const startTime = Number(config.headers["X-Request-Start-Time"]);
    const duration = startTime ? Date.now() - startTime : 0;

    // Log the request telemetry details (method, endpoint, HTTP status, and duration).
    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.url} - ${response.status} (${duration}ms) [ID: ${config.headers["X-Request-ID"]}]`
    );

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    // Log request failure details even for unsuccessful responses.
    if (config) {
      const startTime = Number(config.headers["X-Request-Start-Time"]);
      const duration = startTime ? Date.now() - startTime : 0;
      console.error(
        `[API] ${config.method?.toUpperCase()} ${config.url} - ${error.response?.status || "Network Error"} (${duration}ms) [ID: ${config.headers["X-Request-ID"]}]`
      );
    }

    // Ignore redirection or token refreshes for non-401 errors, or if the request config is missing.
    if (error.response?.status !== 401 || !config || config.url === API.AUTH.REFRESH) {
      // Show friendly error toast for network disruptions, server failures, and timeouts.
      if (typeof window !== "undefined") {
        const msg = getFriendlyErrorMessage(error);
        // Exclude cancelled requests to avoid popping spammy alerts when users navigate away.
        if (error.code !== "ERR_CANCELED") {
          toast.error(msg);
        }
      }
      return Promise.reject(error);
    }

    // If a token refresh cycle is already running, queue subsequent failed requests until complete.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark the token refresh cycle as active.
    isRefreshing = true;
    config._retry = true;

    const refreshTokenVal = getRefreshToken();
    if (!refreshTokenVal) {
      isRefreshing = false;
      clearAuthStorage();
      
      // Perform client-side redirect to the login screen and alert the user.
      if (typeof window !== "undefined") {
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    try {
      // Call token refresh route to issue a new access token pair.
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}${API.AUTH.REFRESH}`,
        { refresh_token: refreshTokenVal },
        {
          timeout: API_TIMEOUT_MS,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // Re-assign the authentication header for the queued original request.
      config.headers.Authorization = `Bearer ${newAccessToken}`;

      // Release all other queued requests.
      processQueue(null, newAccessToken);
      isRefreshing = false;

      return api(config);
    } catch (refreshError) {
      // If the refresh operation itself fails (e.g., token revoked), clean storage and log out.
      processQueue(refreshError, null);
      isRefreshing = false;
      clearAuthStorage();

      if (typeof window !== "undefined") {
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
