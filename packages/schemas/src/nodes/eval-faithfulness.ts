import { z } from "zod";

/**
 * Faithfulness Evaluator Node
 * LLM-as-judge: Is the answer grounded in the retrieved context?
 * Decomposes the answer into claims and checks each against provided documents.
 */
export const evalFaithfulnessConfigSchema = z.object({
  model: z
    .enum(["gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"])
    .default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).default(0),
});

export const evalFaithfulnessInputSchema = z.object({
  query: z.string(),
  answer: z.string(),
  contexts: z.array(z.string()),
});

export const faithfulnessClaimSchema = z.object({
  claim: z.string(),
  supported: z.boolean(),
  evidence: z.string(),
});

export const evalFaithfulnessOutputSchema = z.object({
  score: z.number().min(0).max(1),
  reasoning: z.string(),
  claims: z.array(faithfulnessClaimSchema),
});

export type EvalFaithfulnessConfig = z.infer<typeof evalFaithfulnessConfigSchema>;
export type EvalFaithfulnessInput = z.infer<typeof evalFaithfulnessInputSchema>;
export type EvalFaithfulnessOutput = z.infer<typeof evalFaithfulnessOutputSchema>;
export type FaithfulnessClaim = z.infer<typeof faithfulnessClaimSchema>;
