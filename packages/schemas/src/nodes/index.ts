import { z } from "zod";

// Re-export all node schemas
export * from "./query";
export * from "./embed";
export * from "./retrieve";
export * from "./generate";
export * from "./hyde";
export * from "./rerank";
export * from "./judge";
export * from "./agent";
export * from "./eval-faithfulness";
export * from "./eval-relevancy";
export * from "./eval-context-precision";
export * from "./ports";
export * from "./connections";

// Base node schema
export const baseNodeSchema = z.object({
  id: z.string(),
  type: z.enum([
    "query",
    "embed",
    "retrieve",
    "generate",
    "hyde",
    "rerank",
    "judge",
    "agent",
    "fusion",
    "router",
    "query-rewriter",
    "context-compressor",
    "context-optimizer",
    "web-search",
    "eval-faithfulness",
    "eval-relevancy",
    "eval-context-precision",
  ]),
  label: z.string(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type BaseNode = z.infer<typeof baseNodeSchema>;
export type NodeType = BaseNode["type"];

// Node type constants for type safety
export const NODE_TYPES = {
  QUERY: "query",
  EMBED: "embed",
  RETRIEVE: "retrieve",
  GENERATE: "generate",
  HYDE: "hyde",
  RERANK: "rerank",
  JUDGE: "judge",
  AGENT: "agent",
  FUSION: "fusion",
  ROUTER: "router",
  QUERY_REWRITER: "query-rewriter",
  CONTEXT_COMPRESSOR: "context-compressor",
  CONTEXT_OPTIMIZER: "context-optimizer",
  WEB_SEARCH: "web-search",
  EVAL_FAITHFULNESS: "eval-faithfulness",
  EVAL_RELEVANCY: "eval-relevancy",
  EVAL_CONTEXT_PRECISION: "eval-context-precision",
} as const;
