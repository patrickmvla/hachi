import { apiFetch } from "@/lib/api";

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
  const { data, error } = await apiFetch<{
    documents: Document[];
    stats: DocumentStats;
  }>(`/api/documents?organizationId=${orgId}`);
  if (error) throw new Error(error);
  return data!;
}

export async function fetchDocument(id: string) {
  const { data, error } = await apiFetch<{ document: Document }>(
    `/api/documents/${id}`
  );
  if (error) throw new Error(error);
  return data!.document;
}

export async function uploadDocument(
  organizationId: string,
  filename: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await apiFetch<{ document: Document }>(
    `/api/documents?organizationId=${organizationId}`,
    {
      method: "POST",
      body: JSON.stringify({ filename, content, metadata }),
    }
  );
  if (error) throw new Error(error);
  return data!.document;
}

export async function processDocument(
  id: string,
  options?: { chunkSize?: number; chunkOverlap?: number }
) {
  const { data, error } = await apiFetch<{
    success: boolean;
    documentType: string;
    totalChunks: number;
    totalCharacters: number;
    embeddingDimensions: number;
  }>(`/api/documents/${id}/process`, {
    method: "POST",
    body: JSON.stringify(options || {}),
  });
  if (error) throw new Error(error);
  return data!;
}

export async function deleteDocument(id: string) {
  const { data, error } = await apiFetch<{ deleted: boolean; id: string }>(
    `/api/documents/${id}`,
    { method: "DELETE" }
  );
  if (error) throw new Error(error);
  return data!;
}

export async function searchDocuments(
  organizationId: string,
  query: string,
  options?: { limit?: number; minScore?: number }
) {
  const { data, error } = await apiFetch<{ results: SearchResult[] }>(
    `/api/documents/search?organizationId=${organizationId}`,
    {
      method: "POST",
      body: JSON.stringify({ query, ...options }),
    }
  );
  if (error) throw new Error(error);
  return data!.results;
}
