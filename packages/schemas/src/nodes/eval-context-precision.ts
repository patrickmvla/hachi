import { z } from "zod";

/**
 * Context Precision Evaluator Node
 * LLM-as-judge: Are relevant documents ranked higher in the retrieval results?
 * Evaluates each document's relevance and whether the ranking is optimal.
 */
export const evalContextPrecisionConfigSchema = z.object({
  model: z
    .enum(["gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"])
    .default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).default(0),
});

export const evalContextPrecisionInputSchema = z.object({
  query: z.string(),
  documents: z.array(
    z.object({
      content: z.string(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
  ),
  groundTruth: z.string().optional(),
});

export const docRelevanceSchema = z.object({
  documentIndex: z.number(),
  relevant: z.boolean(),
  reasoning: z.string(),
});

export const evalContextPrecisionOutputSchema = z.object({
  score: z.number().min(0).max(1),
  reasoning: z.string(),
  perDocRelevance: z.array(docRelevanceSchema),
});

export type EvalContextPrecisionConfig = z.infer<typeof evalContextPrecisionConfigSchema>;
export type EvalContextPrecisionInput = z.infer<typeof evalContextPrecisionInputSchema>;
export type EvalContextPrecisionOutput = z.infer<typeof evalContextPrecisionOutputSchema>;
export type DocRelevance = z.infer<typeof docRelevanceSchema>;
