import { z } from "zod";

/**
 * Chunking strategy options based on Mastra's MDocument
 */
export const chunkingStrategySchema = z.enum([
  "recursive", // Default - recursively splits by separators
  "character", // Simple character-based splitting
  "token",     // Token-based splitting
  "markdown",  // Markdown-aware splitting
  "html",      // HTML-aware splitting
  "json",      // JSON-aware splitting
  "latex",     // LaTeX-aware splitting
]).default("recursive");

/**
 * Chunking configuration
 */
export const chunkingConfigSchema = z.object({
  strategy: chunkingStrategySchema.optional(),
  size: z.number().min(1).default(512),
  overlap: z.number().min(0).default(50),
  separator: z.string().optional(), // Custom separator for character strategy
});

/**
 * Embed Node Schema
 * Converts text to vector embeddings using an embedding model
 * Supports optional chunking via Mastra's MDocument
 */
export const embedNodeConfigSchema = z.object({
  model: z.enum([
    "text-embedding-3-small",
    "text-embedding-3-large",
    "text-embedding-ada-002",
  ]).default("text-embedding-3-small"),
  dimensions: z.number().optional(), // Only for text-embedding-3-* models
  chunking: chunkingConfigSchema.optional(), // Optional chunking configuration
});

export const embedNodeInputSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
});

/**
 * Chunk with its embedding
 */
export const embeddedChunkSchema = z.object({
  text: z.string(),
  embedding: z.array(z.number()),
  index: z.number(),
  metadata: z.record(z.unknown()).optional(),
});

export const embedNodeOutputSchema = z.object({
  text: z.string(),
  embedding: z.array(z.number()), // Primary embedding (first chunk or full text)
  model: z.string(),
  dimensions: z.number(),
  tokenCount: z.number().optional(),
  chunks: z.array(embeddedChunkSchema).optional(), // Chunked embeddings if chunking enabled
});

export type ChunkingStrategy = z.infer<typeof chunkingStrategySchema>;
export type ChunkingConfig = z.infer<typeof chunkingConfigSchema>;
export type EmbedNodeConfig = z.infer<typeof embedNodeConfigSchema>;
export type EmbedNodeInput = z.infer<typeof embedNodeInputSchema>;
export type EmbeddedChunk = z.infer<typeof embeddedChunkSchema>;
export type EmbedNodeOutput = z.infer<typeof embedNodeOutputSchema>;
