import type { NodeType } from "./index";

export enum PortType {
  Query = "query",
  Text = "text",
  Embedding = "embedding",
  Documents = "documents",
  Response = "response",
  Judgments = "judgments",
  HypotheticalDocs = "hypotheticalDocs",
  EvalScore = "evalScore",
}

/** Colors for typed handles — maps to Tailwind-compatible hex values */
export const PORT_TYPE_COLORS: Record<PortType, string> = {
  [PortType.Query]: "#3b82f6",         // blue-500
  [PortType.Text]: "#6b7280",          // gray-500
  [PortType.Embedding]: "#a855f7",     // purple-500
  [PortType.Documents]: "#f97316",     // orange-500
  [PortType.Response]: "#22c55e",      // green-500
  [PortType.Judgments]: "#ef4444",     // red-500
  [PortType.HypotheticalDocs]: "#06b6d4", // cyan-500
  [PortType.EvalScore]: "#eab308",     // yellow-500
};

/** Maps port types to edge data types for auto-assignment */
export const PORT_TO_EDGE_DATA_TYPE: Record<PortType, "string" | "vector" | "document" | "json"> = {
  [PortType.Query]: "string",
  [PortType.Text]: "string",
  [PortType.Embedding]: "vector",
  [PortType.Documents]: "document",
  [PortType.Response]: "string",
  [PortType.Judgments]: "json",
  [PortType.HypotheticalDocs]: "document",
  [PortType.EvalScore]: "json",
};

/** Port declarations for each node type (uses backend type names) */
export const NODE_PORTS: Record<NodeType, { inputs: PortType[]; outputs: PortType[] }> = {
  query:    { inputs: [],                                    outputs: [PortType.Query] },
  embed:    { inputs: [PortType.Query, PortType.Text],       outputs: [PortType.Embedding] },
  retrieve: { inputs: [PortType.Embedding],                  outputs: [PortType.Documents] },
  rerank:   { inputs: [PortType.Documents],                  outputs: [PortType.Documents] },
  judge:    { inputs: [PortType.Documents],                  outputs: [PortType.Judgments] },
  generate: { inputs: [PortType.Query, PortType.Documents],  outputs: [PortType.Response] },
  hyde:     { inputs: [PortType.Query],                      outputs: [PortType.HypotheticalDocs] },
  agent:    { inputs: [PortType.Query, PortType.Documents],  outputs: [PortType.Response] },
  "eval-faithfulness":      { inputs: [PortType.Query, PortType.Response, PortType.Documents], outputs: [PortType.EvalScore] },
  "eval-relevancy":         { inputs: [PortType.Query, PortType.Response],                     outputs: [PortType.EvalScore] },
  "eval-context-precision": { inputs: [PortType.Query, PortType.Documents],                    outputs: [PortType.EvalScore] },
};

/**
 * Maps frontend node type names to backend type names.
 * Frontend uses: embedding, retriever, reranker, llm
 * Backend uses:  embed, retrieve, rerank, generate
 */
export const FRONTEND_TO_BACKEND_TYPE: Record<string, NodeType> = {
  embedding: "embed",
  retriever: "retrieve",
  reranker: "rerank",
  llm: "generate",
  // Evaluator maps to faithfulness by default; resolved dynamically in graph-transform
  evaluator: "eval-faithfulness",
};

/** Resolves a frontend node type to its backend equivalent */
export function resolveNodeType(frontendType: string): NodeType {
  return (FRONTEND_TO_BACKEND_TYPE[frontendType] ?? frontendType) as NodeType;
}
