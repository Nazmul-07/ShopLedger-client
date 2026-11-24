import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!envApiUrl) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not configured. Please set it in .env.local."
  );
}

// Use Next.js same-origin rewrite proxy in the browser to avoid CORS blocks
// from the deployed backend, while still reading NEXT_PUBLIC_API_URL.
const baseURL =
  typeof window !== "undefined" ? "/api/proxy" : envApiUrl || "";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Extract a clean, human-readable error message from Axios or unknown errors.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;

    if (!axiosErr.response) {
      if (axiosErr.code === "ECONNABORTED") {
        return "Request timed out. Please check your connection and try again.";
      }
      return "Unable to reach the server. Please check your internet connection.";
    }

    const data = axiosErr.response.data;

    if (data && typeof data === "object") {
      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message;
      }
      if (typeof data.error === "string" && data.error.trim().length > 0) {
        return data.error;
      }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const messages = data.errors
          .map((item) => item.message)
          .filter((msg): msg is string => Boolean(msg));
        if (messages.length > 0) return messages.join(", ");
      }
    }

    const status = axiosErr.response.status;
    if (status === 400) return "Invalid request data. Please check your input.";
    if (status === 404) return "The requested record was not found.";
    if (status === 409) return "This record conflicts with an existing entry.";
    if (status >= 500) return "Server error occurred. Please try again later.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Unwrap a standard `{ success, message, data }` response or direct payload.
 */
export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if ("data" in record && record.data !== undefined) {
      return record.data as T;
    }
  }
  return payload as T;
}

/**
 * Unwrap array responses, including endpoints that spread array items onto the
 * response object alongside `success` and `message` (e.g. GET /products).
 */
export function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as T[];
    }

    const numericKeys = Object.keys(record)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b));

    if (numericKeys.length > 0) {
      return numericKeys.map((key) => record[key] as T);
    }

    if ("success" in record && record.data === undefined) {
      return [];
    }
  }

  return [];
}
