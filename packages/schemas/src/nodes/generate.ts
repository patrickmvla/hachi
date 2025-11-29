import { z } from "zod";

/**
 * Generate Node Schema
 * Uses an LLM to generate text responses
 */
export const generateNodeConfigSchema = z.object({
  model: z.enum([
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-3.5-turbo",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-3-5-sonnet-20241022",
  ]).default("gpt-4o-mini"),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(128000).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  responseFormat: z.enum(["text", "json"]).default("text"),
});

export const generateNodeInputSchema = z.object({
  query: z.string(),
  context: z.string().optional(), // Retrieved documents as context
  documents: z.array(z.object({
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  })).optional(),
});

export const generateNodeOutputSchema = z.object({
  response: z.string(),
  model: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
  finishReason: z.string().optional(),
});

export type GenerateNodeConfig = z.infer<typeof generateNodeConfigSchema>;
export type GenerateNodeInput = z.infer<typeof generateNodeInputSchema>;
export type GenerateNodeOutput = z.infer<typeof generateNodeOutputSchema>;
