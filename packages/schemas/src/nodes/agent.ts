import { z } from "zod";

/**
 * Agent Node Schema
 * Autonomous agent with access to tools (ReAct pattern)
 */
export const agentNodeConfigSchema = z.object({
  model: z.enum([
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-4o-mini",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-5-sonnet-20241022",
  ]).default("gpt-4o"),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxIterations: z.number().min(1).max(20).default(5),
  tools: z.array(z.enum([
    "web_search",
    "code_executor",
    "http_request",
    "retrieval",
  ])).default(["web_search", "retrieval"]),
  stopConditions: z.array(z.string()).optional(),
});

export const agentNodeInputSchema = z.object({
  query: z.string(),
  context: z.string().optional(),
  documents: z.array(z.object({
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  })).optional(),
});

export const agentStepSchema = z.object({
  iteration: z.number(),
  thought: z.string(),
  action: z.string().optional(),
  actionInput: z.record(z.unknown()).optional(),
  observation: z.string().optional(),
  timestamp: z.string(),
});

export const agentNodeOutputSchema = z.object({
  response: z.string(),
  steps: z.array(agentStepSchema),
  totalIterations: z.number(),
  toolsUsed: z.array(z.string()),
  model: z.string(),
});

export type AgentNodeConfig = z.infer<typeof agentNodeConfigSchema>;
export type AgentNodeInput = z.infer<typeof agentNodeInputSchema>;
export type AgentNodeOutput = z.infer<typeof agentNodeOutputSchema>;
export type AgentStep = z.infer<typeof agentStepSchema>;
