import { z } from "zod";

/**
 * Reranking provider types based on Mastra's built-in providers
 */
export const rerankProviderSchema = z.enum([
  "cohere",      // CohereRelevanceScorer
  "mastra",      // MastraAgentRelevanceScorer (LLM-based)
  "zero-entropy", // ZeroEntropyRelevanceScorer
]);

/**
 * Rerank Node Schema
 * Re-orders retrieved documents using Mastra's reranking providers
 */
export const rerankNodeConfigSchema = z.object({
  provider: rerankProviderSchema.default("cohere"),
  model: z.string().default("rerank-v3.5"), // Provider-specific model
  topN: z.number().min(1).max(100).default(3), // Return top N after reranking
  weights: z.object({
    semantic: z.number().min(0).max(1).default(0.5),
    vector: z.number().min(0).max(1).default(0.5),
  }).optional(), // For hybrid scoring
});

export const rerankNodeInputSchema = z.object({
  query: z.string(),
  documents: z.array(z.object({
    id: z.string(),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
    score: z.number().optional(), // Original retrieval score
  })),
});

export const rerankNodeOutputSchema = z.object({
  query: z.string(),
  documents: z.array(z.object({
    id: z.string(),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
    originalScore: z.number().optional(),
    rerankScore: z.number(),
    rank: z.number(),
  })),
  model: z.string(),
  provider: z.string(),
});

export type RerankProvider = z.infer<typeof rerankProviderSchema>;
export type RerankNodeConfig = z.infer<typeof rerankNodeConfigSchema>;
export type RerankNodeInput = z.infer<typeof rerankNodeInputSchema>;
export type RerankNodeOutput = z.infer<typeof rerankNodeOutputSchema>;
