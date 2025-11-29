import { z } from "zod";

/**
 * Judge Node Schema (CRAG - Corrective RAG)
 * Evaluates relevance of retrieved documents and routes accordingly
 */
export const judgeNodeConfigSchema = z.object({
  model: z.enum([
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-3.5-turbo",
  ]).default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).default(0),
  relevanceThreshold: z.number().min(0).max(1).default(0.7),
  criteria: z.array(z.string()).default([
    "Relevance to the query",
    "Information completeness",
    "Factual accuracy indicators",
  ]),
  systemPrompt: z.string().optional(),
});

export const judgeNodeInputSchema = z.object({
  query: z.string(),
  documents: z.array(z.object({
    id: z.string(),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
    score: z.number().optional(),
  })),
});

export const documentJudgmentSchema = z.object({
  id: z.string(),
  content: z.string(),
  relevanceScore: z.number(),
  isRelevant: z.boolean(),
  reasoning: z.string(),
});

export const judgeNodeOutputSchema = z.object({
  query: z.string(),
  judgments: z.array(documentJudgmentSchema),
  relevantDocuments: z.array(documentJudgmentSchema),
  irrelevantDocuments: z.array(documentJudgmentSchema),
  overallAssessment: z.enum(["sufficient", "insufficient", "ambiguous"]),
  recommendation: z.enum(["proceed", "refine_query", "web_search", "fallback"]),
  reasoning: z.string(),
});

export type JudgeNodeConfig = z.infer<typeof judgeNodeConfigSchema>;
export type JudgeNodeInput = z.infer<typeof judgeNodeInputSchema>;
export type JudgeNodeOutput = z.infer<typeof judgeNodeOutputSchema>;
export type DocumentJudgment = z.infer<typeof documentJudgmentSchema>;
