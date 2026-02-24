/**
 * Core API client utilities for communicating with the Hachi API.
 *
 * Resource-specific API functions live in their feature directories:
 *   - features/canvas/api/canvas-api.ts
 *   - features/documents/api/documents-api.ts
 *   - features/runs/api/runs-api.ts
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export type ApiResponse<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: string };

/** Unwrap an ApiResponse, throwing on error. */
export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.error !== undefined) {
    throw new Error(response.error);
  }
  return response.data;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const body: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof body === "object" && body !== null && "error" in body
          ? String((body as { error: unknown }).error)
          : "Request failed";
      return { error: message };
    }

    return { data: body as T };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}
