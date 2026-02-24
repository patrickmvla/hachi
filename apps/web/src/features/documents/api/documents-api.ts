import { apiFetch, unwrap } from "@/lib/api";

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

export async function fetchDocumentList(orgId: string) {
  return unwrap(
    await apiFetch<{ documents: Document[]; stats: DocumentStats }>(
      `/api/documents?organizationId=${orgId}`
    )
  );
}

export async function fetchDocument(id: string) {
  const { document } = unwrap(
    await apiFetch<{ document: Document }>(`/api/documents/${id}`)
  );
  return document;
}

export async function uploadDocument(
  organizationId: string,
  filename: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  const { document } = unwrap(
    await apiFetch<{ document: Document }>(
      `/api/documents?organizationId=${organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({ filename, content, metadata }),
      }
    )
  );
  return document;
}

export async function processDocument(
  id: string,
  options?: { chunkSize?: number; chunkOverlap?: number }
) {
  return unwrap(
    await apiFetch<{
      success: boolean;
      documentType: string;
      totalChunks: number;
      totalCharacters: number;
      embeddingDimensions: number;
    }>(`/api/documents/${id}/process`, {
      method: "POST",
      body: JSON.stringify(options || {}),
    })
  );
}

export async function deleteDocument(id: string) {
  return unwrap(
    await apiFetch<{ deleted: boolean; id: string }>(`/api/documents/${id}`, {
      method: "DELETE",
    })
  );
}

export async function searchDocuments(
  organizationId: string,
  query: string,
  options?: { limit?: number; minScore?: number }
) {
  const { results } = unwrap(
    await apiFetch<{ results: SearchResult[] }>(
      `/api/documents/search?organizationId=${organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({ query, ...options }),
      }
    )
  );
  return results;
}
