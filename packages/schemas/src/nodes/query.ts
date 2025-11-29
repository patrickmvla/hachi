import { z } from "zod";

/**
 * Query Node Schema
 * The entry point for RAG pipelines - handles user input
 */
export const queryNodeConfigSchema = z.object({
  placeholder: z.string().default("Enter your query..."),
  maxLength: z.number().optional(),
});

export const queryNodeInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});

export const queryNodeOutputSchema = z.object({
  query: z.string(),
  timestamp: z.string(),
});

export type QueryNodeConfig = z.infer<typeof queryNodeConfigSchema>;
export type QueryNodeInput = z.infer<typeof queryNodeInputSchema>;
export type QueryNodeOutput = z.infer<typeof queryNodeOutputSchema>;
