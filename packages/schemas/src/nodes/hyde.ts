import { z } from "zod";

/**
 * HyDE (Hypothetical Document Embeddings) Node Schema
 * Generates hypothetical answers to improve retrieval for short queries
 */
export const hydeNodeConfigSchema = z.object({
  model: z.enum([
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-3.5-turbo",
  ]).default("gpt-4o-mini"),
  temperature: z.number().min(0).max(2).default(0.7),
  numHypothetical: z.number().min(1).max(5).default(1), // Number of hypothetical docs to generate
  systemPrompt: z.string().default(
    "Given a query, write a hypothetical document that would perfectly answer this query. Be detailed and specific."
  ),
});

export const hydeNodeInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});

export const hydeNodeOutputSchema = z.object({
  query: z.string(),
  hypotheticalDocuments: z.array(z.string()),
  model: z.string(),
});

export type HyDENodeConfig = z.infer<typeof hydeNodeConfigSchema>;
export type HyDENodeInput = z.infer<typeof hydeNodeInputSchema>;
export type HyDENodeOutput = z.infer<typeof hydeNodeOutputSchema>;
