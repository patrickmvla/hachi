/**
 * API Client for communicating with the Hachi API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
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

// Document types
export interface Document {
  id: string;
  organizationId: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  hasEmbedding: boolean;
  createdAt: string | null;
}

export interface DocumentStats {
  total: number;
  embedded: number;
  pending: number;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
  organizationId: string;
}

// Document API
export const documentsApi = {
  list: async (organizationId: string) => {
    return apiFetch<{ documents: Document[]; stats: DocumentStats }>(
      `/api/documents?organizationId=${organizationId}`
    );
  },

  get: async (id: string) => {
    return apiFetch<{ document: Document }>(`/api/documents/${id}`);
  },

  upload: async (
    organizationId: string,
    filename: string,
    content: string,
    metadata?: Record<string, unknown>
  ) => {
    return apiFetch<{ document: Document }>(`/api/documents?organizationId=${organizationId}`, {
      method: "POST",
      body: JSON.stringify({ filename, content, metadata }),
    });
  },

  process: async (
    id: string,
    options?: { chunkSize?: number; chunkOverlap?: number }
  ) => {
    return apiFetch<{
      success: boolean;
      documentType: string;
      totalChunks: number;
      totalCharacters: number;
      embeddingDimensions: number;
    }>(`/api/documents/${id}/process`, {
      method: "POST",
      body: JSON.stringify(options || {}),
    });
  },

  delete: async (id: string) => {
    return apiFetch<{ deleted: boolean; id: string }>(`/api/documents/${id}`, {
      method: "DELETE",
    });
  },

  search: async (
    organizationId: string,
    query: string,
    options?: { limit?: number; minScore?: number }
  ) => {
    return apiFetch<{ results: SearchResult[] }>(
      `/api/documents/search?organizationId=${organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({ query, ...options }),
      }
    );
  },
};

// Run types
export interface Run {
  id: string;
  canvasId: string;
  triggeredBy: string;
  input: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
}

export interface StepOutput {
  id: string;
  runId: string;
  nodeId: string;
  output: Record<string, unknown>;
  latencyMs: number;
  createdAt: string | null;
}

// Runs API
export const runsApi = {
  list: async (canvasId: string) => {
    return apiFetch<{ runs: Run[] }>(`/api/runs?canvasId=${canvasId}`);
  },

  get: async (id: string) => {
    return apiFetch<{ run: Run; stepOutputs: StepOutput[] }>(`/api/runs/${id}`);
  },

  execute: (canvasId: string, input: Record<string, unknown>) => {
    return new EventSource(
      `${API_BASE_URL}/api/runs/execute?canvasId=${canvasId}&input=${encodeURIComponent(
        JSON.stringify(input)
      )}`
    );
  },
};

// Canvas types
export interface Canvas {
  id: string;
  name: string;
  organizationId: string | null;
  graphJson: { nodes: unknown[]; edges: unknown[] };
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Canvases API
export const canvasesApi = {
  list: async (organizationId: string) => {
    return apiFetch<{ canvases: Canvas[] }>(
      `/api/canvases?organizationId=${organizationId}`
    );
  },

  get: async (id: string) => {
    return apiFetch<{ canvas: Canvas }>(`/api/canvases/${id}`);
  },

  create: async (
    organizationId: string,
    name: string,
    graphJson: { nodes: unknown[]; edges: unknown[] }
  ) => {
    return apiFetch<{ canvas: Canvas }>(`/api/canvases?organizationId=${organizationId}`, {
      method: "POST",
      body: JSON.stringify({ name, graphJson }),
    });
  },

  update: async (
    id: string,
    data: Partial<{
      name: string;
      graphJson: { nodes: unknown[]; edges: unknown[] };
    }>
  ) => {
    return apiFetch<{ canvas: Canvas }>(`/api/canvases/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch<{ deleted: boolean; id: string }>(`/api/canvases/${id}`, {
      method: "DELETE",
    });
  },
};

// Organizations API
export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: string | null;
}

export const organizationsApi = {
  list: async () => {
    return apiFetch<{ organizations: Organization[] }>("/api/organizations");
  },

  get: async (id: string) => {
    return apiFetch<{ organization: Organization }>(`/api/organizations/${id}`);
  },

  create: async (name: string, slug: string) => {
    return apiFetch<{ organization: Organization }>("/api/organizations", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    });
  },

  update: async (id: string, data: { name?: string; slug?: string }) => {
    return apiFetch<{ organization: Organization }>(`/api/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch<{ success: boolean; deleted: string }>(
      `/api/organizations/${id}`,
      { method: "DELETE" }
    );
  },
};
