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
  ]),
  label: z.string(),
  config: z.record(z.unknown()).optional(),
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
} as const;
