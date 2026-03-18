import type { NodeType } from "./index";

export enum PortType {
  Query = "query",
  Text = "text",
  Embedding = "embedding",
  Document = "document",
  Documents = "documents",
  LlmResponse = "llmResponse",
  Score = "score",
  Verdict = "verdict",
  Json = "json",
}

/** Colors for typed handles — maps to hex values aligned with research docs */
export const PORT_TYPE_COLORS: Record<PortType, string> = {
  [PortType.Query]: "#6366f1",         // indigo-500
  [PortType.Text]: "#3b82f6",          // blue-500
  [PortType.Embedding]: "#06b6d4",     // cyan-500
  [PortType.Document]: "#22c55e",      // green-500
  [PortType.Documents]: "#16a34a",     // green-600
  [PortType.LlmResponse]: "#eab308",   // yellow-500
  [PortType.Score]: "#f97316",         // orange-500
  [PortType.Verdict]: "#ef4444",       // red-500
  [PortType.Json]: "#8b5cf6",          // purple-500
};

/** Maps port types to edge data types for auto-assignment */
export const PORT_TO_EDGE_DATA_TYPE: Record<PortType, "string" | "vector" | "document" | "json"> = {
  [PortType.Query]: "string",
  [PortType.Text]: "string",
  [PortType.Embedding]: "vector",
  [PortType.Document]: "document",
  [PortType.Documents]: "document",
  [PortType.LlmResponse]: "string",
  [PortType.Score]: "json",
  [PortType.Verdict]: "json",
  [PortType.Json]: "json",
};

/** Port declarations for each node type (uses backend type names) */
export const NODE_PORTS: Record<NodeType, { inputs: PortType[]; outputs: PortType[] }> = {
  query:    { inputs: [],                                        outputs: [PortType.Query] },
  embed:    { inputs: [PortType.Query, PortType.Text],           outputs: [PortType.Embedding] },
  retrieve: { inputs: [PortType.Embedding],                      outputs: [PortType.Documents] },
  rerank:   { inputs: [PortType.Documents],                      outputs: [PortType.Documents] },
  judge:    { inputs: [PortType.Documents],                      outputs: [PortType.Verdict] },
  generate: { inputs: [PortType.Query, PortType.Documents],      outputs: [PortType.LlmResponse] },
  hyde:     { inputs: [PortType.Query],                          outputs: [PortType.Document] },
  agent:    { inputs: [PortType.Query, PortType.Documents],      outputs: [PortType.LlmResponse] },
  fusion:              { inputs: [PortType.Documents, PortType.Documents], outputs: [PortType.Documents] },
  router:              { inputs: [PortType.Query],                         outputs: [PortType.Query] },
  "query-rewriter":    { inputs: [PortType.Query],                         outputs: [PortType.Query] },
  "context-compressor": { inputs: [PortType.Documents],                    outputs: [PortType.Documents] },
  "context-optimizer":  { inputs: [PortType.Documents],                    outputs: [PortType.Documents] },
  "web-search":         { inputs: [PortType.Query],                        outputs: [PortType.Documents] },
  "eval-faithfulness":      { inputs: [PortType.Query, PortType.LlmResponse, PortType.Documents], outputs: [PortType.Score] },
  "eval-relevancy":         { inputs: [PortType.Query, PortType.LlmResponse],                     outputs: [PortType.Score] },
  "eval-context-precision": { inputs: [PortType.Query, PortType.Documents],                        outputs: [PortType.Score] },
};

/**
 * Maps frontend node type names to backend type names.
 * Frontend uses: embedding, retriever, reranker, llm, etc.
 * Backend uses:  embed, retrieve, rerank, generate, etc.
 */
export const FRONTEND_TO_BACKEND_TYPE: Record<string, NodeType> = {
  embedding: "embed",
  retriever: "retrieve",
  reranker: "rerank",
  llm: "generate",
  evaluator: "eval-faithfulness",
  queryRewriter: "query-rewriter",
  contextCompressor: "context-compressor",
  contextOptimizer: "context-optimizer",
  webSearch: "web-search",
};

/** Resolves a frontend node type to its backend equivalent */
export function resolveNodeType(frontendType: string): NodeType {
  return (FRONTEND_TO_BACKEND_TYPE[frontendType] ?? frontendType) as NodeType;
}
