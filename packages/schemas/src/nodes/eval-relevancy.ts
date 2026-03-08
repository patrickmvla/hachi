import { z } from "zod";

/**
 * Relevancy Evaluator Node
 * LLM-as-judge: Is the answer relevant to the query?
 */
export const evalRelevancyConfigSchema = z.object({
  model: z
    .enum(["gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"])
    .default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).default(0),
});

export const evalRelevancyInputSchema = z.object({
  query: z.string(),
  answer: z.string(),
});

export const evalRelevancyOutputSchema = z.object({
  score: z.number().min(0).max(1),
  reasoning: z.string(),
});

export type EvalRelevancyConfig = z.infer<typeof evalRelevancyConfigSchema>;
export type EvalRelevancyInput = z.infer<typeof evalRelevancyInputSchema>;
export type EvalRelevancyOutput = z.infer<typeof evalRelevancyOutputSchema>;
