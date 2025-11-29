import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import type { DocumentChunk } from "./chunker";

/**
 * Embedding configuration options
 */
export interface EmbedOptions {
  /** OpenAI API key */
  apiKey: string;
  /** Embedding model to use */
  model?: string;
  /** Batch size for embedMany */
  batchSize?: number;
}

/**
 * A chunk with its embedding vector
 */
export interface EmbeddedChunk extends DocumentChunk {
  /** The embedding vector */
  embedding: number[];
  /** Embedding model used */
  embeddingModel: string;
  /** Embedding dimensions */
  dimensions: number;
}

/**
 * Default embedding configuration
 */
const DEFAULT_EMBED_OPTIONS = {
  model: "text-embedding-3-small",
  batchSize: 100,
};

/**
 * Embed a single text string
 */
export const embedText = async (
  text: string,
  options: EmbedOptions
): Promise<{ embedding: number[]; model: string; dimensions: number }> => {
  const model = options.model || DEFAULT_EMBED_OPTIONS.model;

  const result = await embed({
    model: openai.embedding(model, {
      dimensions: 1536,
    }),
    value: text,
  });

  return {
    embedding: result.embedding,
    model,
    dimensions: result.embedding.length,
  };
};

/**
 * Embed multiple texts in batches
 */
export const embedTexts = async (
  texts: string[],
  options: EmbedOptions
): Promise<{ embeddings: number[][]; model: string; dimensions: number }> => {
  const model = options.model || DEFAULT_EMBED_OPTIONS.model;
  const batchSize = options.batchSize || DEFAULT_EMBED_OPTIONS.batchSize;

  const allEmbeddings: number[][] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const result = await embedMany({
      model: openai.embedding(model, {
        dimensions: 1536,
      }),
      values: batch,
    });

    allEmbeddings.push(...result.embeddings);
  }

  return {
    embeddings: allEmbeddings,
    model,
    dimensions: allEmbeddings[0]?.length || 1536,
  };
};

/**
 * Embed document chunks
 */
export const embedChunks = async (
  chunks: DocumentChunk[],
  options: EmbedOptions
): Promise<EmbeddedChunk[]> => {
  if (chunks.length === 0) return [];

  const texts = chunks.map((chunk) => chunk.content);
  const { embeddings, model, dimensions } = await embedTexts(texts, options);

  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index] || [],
    embeddingModel: model,
    dimensions,
  }));
};

/**
 * Embed a query for vector search
 */
export const embedQuery = async (
  query: string,
  options: EmbedOptions
): Promise<number[]> => {
  const { embedding } = await embedText(query, options);
  return embedding;
};

/**
 * Calculate cosine similarity between two vectors
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * In-memory vector search (for testing/development)
 */
export const searchInMemory = (
  queryEmbedding: number[],
  documents: EmbeddedChunk[],
  topK: number = 10,
  minScore: number = 0
): Array<EmbeddedChunk & { score: number }> => {
  const scored = documents.map((doc) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  return scored
    .filter((doc) => doc.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};
