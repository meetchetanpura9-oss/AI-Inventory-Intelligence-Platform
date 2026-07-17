interface AxiosErrorLike {
  code?: string;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

/**
 * Converts a raw network or HTTP exception into a clean, readable message string.
 * This is used to present friendly notifications to users instead of printing cryptic stack traces.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (typeof window === "undefined") return "An error occurred";

  if (error && typeof error === "object") {
    const err = error as AxiosErrorLike;

    // Check if the request was cancelled intentionally (e.g., page change)
    if (err.code === "ERR_CANCELED") {
      return "Request was cancelled.";
    }

    // Check for offline states or general network failures
    if (err.message === "Network Error" || !window.navigator.onLine) {
      return "Network connection issue. Please check your internet connection and try again.";
    }

    // Check for network timeouts
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return "Request timed out. The server is taking too long to respond. Please try again later.";
    }

    // Inspect HTTP status codes
    if (err.response) {
      const status = err.response.status;
      switch (status) {
        case 400:
          return err.response.data?.message || "Invalid request. Please check your inputs.";
        case 401:
          return "Your session has expired. Please log in again.";
        case 403:
          return "Access denied. You do not have permission to view this resource.";
        case 404:
          return "The requested resource could not be found.";
        case 422:
          return "Validation failed. Some input fields contain invalid or missing parameters.";
        case 500:
          return "Internal server error. Our engineering team has been notified.";
        default:
          return err.response.data?.message || "An unexpected error occurred.";
      }
    }
  }

  return "An unexpected error occurred. Please try again.";
}
