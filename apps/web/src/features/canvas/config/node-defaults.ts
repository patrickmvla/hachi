type NodeType = "query" | "hyde" | "embedding" | "retriever" | "reranker" | "judge" | "llm" | "agent" | "evaluator" | "queryRewriter" | "router" | "contextCompressor" | "contextOptimizer" | "webSearch" | "fusion";

type NodeDefaultsMap = {
  [K in NodeType]: Record<string, unknown>;
};

export const nodeDefaults: NodeDefaultsMap = {
  query: {},
  hyde: {
    model: "gpt-4-turbo",
    maxTokens: 256,
  },
  embedding: {
    model: "text-embedding-3-small",
    dimensions: 1536,
  },
  retriever: {
    topK: 5,
    similarityThreshold: 0.8,
    vectorStore: "default",
  },
  reranker: {
    topN: 3,
    model: "cross-encoder/ms-marco",
  },
  judge: {
    criteria: "relevance",
    confidenceThreshold: 0.85,
  },
  llm: {
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 1024,
    systemPrompt: "",
  },
  agent: {
    tools: ["Web Search", "Code Exec"],
    maxIterations: 5,
    model: "gpt-4-turbo",
  },
  evaluator: {
    metric: "faithfulness",
    model: "gpt-4o-mini",
    temperature: 0,
  },
  queryRewriter: {
    strategy: "step-back",
    model: "gpt-4-turbo",
    maxVariants: 1,
  },
  router: {
    strategy: "complexity",
    model: "gpt-4o-mini",
    branches: 3,
  },
  contextCompressor: {
    method: "llmlingua",
    ratio: "10x",
    model: "gpt-4o-mini",
  },
  contextOptimizer: {
    strategy: "relevance-first",
  },
  webSearch: {
    provider: "tavily",
    maxResults: 3,
  },
  fusion: {
    method: "rrf",
    k: 60,
    sources: 2,
  },
};

export function getConfigValue<T>(
  config: Record<string, unknown>,
  defaults: Record<string, unknown>,
  key: string
): T {
  return (config[key] ?? defaults[key]) as T;
}

export function getNodeDefaults(type: string): Record<string, unknown> {
  return nodeDefaults[type as NodeType] ?? {};
}
