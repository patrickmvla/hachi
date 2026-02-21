/**
 * Core API client utilities for communicating with the Hachi API.
 *
 * Resource-specific API functions live in their feature directories:
 *   - features/canvas/api/canvas-api.ts
 *   - features/documents/api/documents-api.ts
 *   - features/runs/api/runs-api.ts
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
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

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Request failed" };
    }

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}
