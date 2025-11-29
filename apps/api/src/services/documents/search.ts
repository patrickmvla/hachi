import { db } from "@hachi/database/client";
import { documents } from "@hachi/database/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { embedQuery, type EmbedOptions } from "./embedder";

/**
 * Search options for vector similarity search
 */
export interface SearchOptions {
  /** Workspace ID to search within */
  workspaceId: string;
  /** Number of results to return */
  topK?: number;
  /** Minimum similarity score (0-1) */
  minScore?: number;
  /** Filter by metadata */
  metadataFilter?: Record<string, unknown>;
}

/**
 * A search result with similarity score
 */
export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
  workspaceId: string;
}

/**
 * Search documents using vector similarity
 */
export const searchDocuments = async (
  query: string,
  embedOptions: EmbedOptions,
  searchOptions: SearchOptions
): Promise<SearchResult[]> => {
  const { workspaceId, topK = 10, minScore = 0.5 } = searchOptions;

  // Generate query embedding
  const queryEmbedding = await embedQuery(query, embedOptions);

  // Search using pgvector cosine distance
  // Note: pgvector uses <=> for cosine distance (1 - similarity)
  // So we need to convert: similarity = 1 - distance
  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      workspaceId: documents.workspaceId,
      // Calculate similarity: 1 - cosine_distance
      score: sql<number>`1 - (${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
    })
    .from(documents)
    .where(
      and(
        eq(documents.workspaceId, workspaceId),
        sql`${documents.embedding} IS NOT NULL`
      )
    )
    .orderBy(
      // Order by cosine distance (ascending = most similar first)
      sql`${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`
    )
    .limit(topK);

  // Filter by minimum score and transform types
  return results
    .filter((result) => result.score >= minScore)
    .map((result) => ({
      id: result.id,
      content: result.content,
      metadata: (result.metadata as Record<string, unknown>) || null,
      workspaceId: result.workspaceId || workspaceId,
      score: result.score,
    }));
};

/**
 * Hybrid search combining vector similarity and keyword matching
 */
export const hybridSearch = async (
  query: string,
  embedOptions: EmbedOptions,
  searchOptions: SearchOptions
): Promise<SearchResult[]> => {
  const { workspaceId, topK = 10, minScore = 0.3 } = searchOptions;

  // Generate query embedding
  const queryEmbedding = await embedQuery(query, embedOptions);

  // Hybrid search: combine vector similarity with text search
  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      workspaceId: documents.workspaceId,
      // Combined score: vector similarity + text relevance
      score: sql<number>`
        CASE
          WHEN ${documents.embedding} IS NOT NULL THEN
            (1 - (${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)) * 0.7 +
            CASE
              WHEN ${documents.content} ILIKE ${'%' + query + '%'} THEN 0.3
              ELSE 0
            END
          ELSE
            CASE
              WHEN ${documents.content} ILIKE ${'%' + query + '%'} THEN 0.3
              ELSE 0
            END
        END
      `,
    })
    .from(documents)
    .where(eq(documents.workspaceId, workspaceId))
    .orderBy(
      desc(sql`
        CASE
          WHEN ${documents.embedding} IS NOT NULL THEN
            (1 - (${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)) * 0.7 +
            CASE
              WHEN ${documents.content} ILIKE ${'%' + query + '%'} THEN 0.3
              ELSE 0
            END
          ELSE
            CASE
              WHEN ${documents.content} ILIKE ${'%' + query + '%'} THEN 0.3
              ELSE 0
            END
        END
      `)
    )
    .limit(topK);

  // Filter by minimum score and transform types
  return results
    .filter((result) => result.score >= minScore)
    .map((result) => ({
      id: result.id,
      content: result.content,
      metadata: (result.metadata as Record<string, unknown>) || null,
      workspaceId: result.workspaceId || workspaceId,
      score: result.score,
    }));
};

/**
 * Get documents by IDs
 */
export const getDocumentsByIds = async (
  ids: string[]
): Promise<Array<{
  id: string;
  content: string;
  metadata: Record<string, unknown> | null;
  workspaceId: string;
}>> => {
  if (ids.length === 0) return [];

  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      workspaceId: documents.workspaceId,
    })
    .from(documents)
    .where(sql`${documents.id} = ANY(${ids})`);

  return results.map((result) => ({
    id: result.id,
    content: result.content,
    metadata: (result.metadata as Record<string, unknown>) || null,
    workspaceId: result.workspaceId || "",
  }));
};

/**
 * Count documents in a workspace
 */
export const countDocuments = async (workspaceId: string): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(documents)
    .where(eq(documents.workspaceId, workspaceId));

  return result[0]?.count || 0;
};

/**
 * Count documents with embeddings in a workspace
 */
export const countEmbeddedDocuments = async (
  workspaceId: string
): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(documents)
    .where(
      and(
        eq(documents.workspaceId, workspaceId),
        sql`${documents.embedding} IS NOT NULL`
      )
    );

  return result[0]?.count || 0;
};
