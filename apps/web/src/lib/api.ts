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
  workspaceId: string | null;
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
  workspaceId: string;
}

// Document API
export const documentsApi = {
  /**
   * List documents in a workspace
   */
  list: async (workspaceId: string) => {
    return apiFetch<{ documents: Document[]; stats: DocumentStats }>(
      `/api/documents?workspaceId=${workspaceId}`
    );
  },

  /**
   * Get a document by ID
   */
  get: async (id: string) => {
    return apiFetch<{ document: Document }>(`/api/documents/${id}`);
  },

  /**
   * Upload a new document
   */
  upload: async (
    workspaceId: string,
    filename: string,
    content: string,
    metadata?: Record<string, unknown>
  ) => {
    return apiFetch<{ document: Document }>(`/api/documents?workspaceId=${workspaceId}`, {
      method: "POST",
      body: JSON.stringify({ filename, content, metadata }),
    });
  },

  /**
   * Process a document (chunk + embed)
   */
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

  /**
   * Delete a document
   */
  delete: async (id: string) => {
    return apiFetch<{ deleted: boolean; id: string }>(`/api/documents/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Search documents
   */
  search: async (
    workspaceId: string,
    query: string,
    options?: { limit?: number; minScore?: number }
  ) => {
    return apiFetch<{ results: SearchResult[] }>(
      `/api/documents/search?workspaceId=${workspaceId}`,
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
  /**
   * List runs for a canvas
   */
  list: async (canvasId: string) => {
    return apiFetch<{ runs: Run[] }>(`/api/runs?canvasId=${canvasId}`);
  },

  /**
   * Get a run by ID
   */
  get: async (id: string) => {
    return apiFetch<{ run: Run; stepOutputs: StepOutput[] }>(`/api/runs/${id}`);
  },

  /**
   * Execute a canvas (returns SSE stream)
   */
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
  workspaceId: string | null;
  graphJson: { nodes: unknown[]; edges: unknown[] };
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Canvases API
export const canvasesApi = {
  /**
   * List canvases for a workspace
   */
  list: async (workspaceId: string) => {
    return apiFetch<{ canvases: Canvas[] }>(
      `/api/canvases?workspaceId=${workspaceId}`
    );
  },

  /**
   * Get a canvas by ID
   */
  get: async (id: string) => {
    return apiFetch<{ canvas: Canvas }>(`/api/canvases/${id}`);
  },

  /**
   * Create a new canvas
   */
  create: async (
    workspaceId: string,
    name: string,
    graphJson: { nodes: unknown[]; edges: unknown[] }
  ) => {
    return apiFetch<{ canvas: Canvas }>(`/api/canvases?workspaceId=${workspaceId}`, {
      method: "POST",
      body: JSON.stringify({ name, workspaceId, graphJson }),
    });
  },

  /**
   * Update a canvas
   */
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

  /**
   * Delete a canvas
   */
  delete: async (id: string) => {
    return apiFetch<{ deleted: boolean; id: string }>(`/api/canvases/${id}`, {
      method: "DELETE",
    });
  },
};

// Workspaces API
export interface Workspace {
  id: string;
  name: string;
  createdAt: string | null;
  role: string;
  joinedAt: string | null;
}

export const workspacesApi = {
  /**
   * List user's workspaces
   */
  list: async () => {
    return apiFetch<{ workspaces: Workspace[] }>("/api/workspaces");
  },

  /**
   * Get workspace by ID
   */
  get: async (id: string) => {
    return apiFetch<{
      workspace: Workspace & { memberCount: number; userRole: string };
    }>(`/api/workspaces/${id}`);
  },

  /**
   * Create a workspace
   */
  create: async (name: string) => {
    return apiFetch<{ workspace: Workspace }>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Update a workspace
   */
  update: async (id: string, data: { name?: string }) => {
    return apiFetch<{ workspace: Workspace }>(`/api/workspaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a workspace
   */
  delete: async (id: string) => {
    return apiFetch<{ success: boolean; deleted: string }>(
      `/api/workspaces/${id}`,
      { method: "DELETE" }
    );
  },
};
