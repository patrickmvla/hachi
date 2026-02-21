import { db } from "@hachi/database/client";
import { documents } from "@hachi/database/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { embedQuery, type EmbedOptions } from "./embedder";

/**
 * Search options for vector similarity search
 */
export interface SearchOptions {
  /** Organization ID to search within */
  organizationId: string;
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
  organizationId: string;
}

/**
 * Search documents using vector similarity
 */
export const searchDocuments = async (
  query: string,
  embedOptions: EmbedOptions,
  searchOptions: SearchOptions
): Promise<SearchResult[]> => {
  const { organizationId, topK = 10, minScore = 0.5 } = searchOptions;

  // Generate query embedding
  const queryEmbedding = await embedQuery(query, embedOptions);

  // Search using pgvector cosine distance
  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      organizationId: documents.organizationId,
      score: sql<number>`1 - (${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
    })
    .from(documents)
    .where(
      and(
        eq(documents.organizationId, organizationId),
        sql`${documents.embedding} IS NOT NULL`
      )
    )
    .orderBy(
      sql`${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`
    )
    .limit(topK);

  return results
    .filter((result) => result.score >= minScore)
    .map((result) => ({
      id: result.id,
      content: result.content,
      metadata: (result.metadata as Record<string, unknown>) || null,
      organizationId: result.organizationId || organizationId,
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
  const { organizationId, topK = 10, minScore = 0.3 } = searchOptions;

  const queryEmbedding = await embedQuery(query, embedOptions);

  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      organizationId: documents.organizationId,
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
    .where(eq(documents.organizationId, organizationId))
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

  return results
    .filter((result) => result.score >= minScore)
    .map((result) => ({
      id: result.id,
      content: result.content,
      metadata: (result.metadata as Record<string, unknown>) || null,
      organizationId: result.organizationId || organizationId,
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
  organizationId: string;
}>> => {
  if (ids.length === 0) return [];

  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      organizationId: documents.organizationId,
    })
    .from(documents)
    .where(sql`${documents.id} = ANY(${ids})`);

  return results.map((result) => ({
    id: result.id,
    content: result.content,
    metadata: (result.metadata as Record<string, unknown>) || null,
    organizationId: result.organizationId || "",
  }));
};

/**
 * Count documents in an organization
 */
export const countDocuments = async (organizationId: string): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(documents)
    .where(eq(documents.organizationId, organizationId));

  return result[0]?.count || 0;
};

/**
 * Count documents with embeddings in an organization
 */
export const countEmbeddedDocuments = async (
  organizationId: string
): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(documents)
    .where(
      and(
        eq(documents.organizationId, organizationId),
        sql`${documents.embedding} IS NOT NULL`
      )
    );

  return result[0]?.count || 0;
};
