import {
  Search,
  FileText,
  GitBranch,
  Database,
  ArrowRightLeft,
  Scale,
  Cpu,
  Bot,
  BarChart3,
  PenLine,
  Route,
  Shrink,
  ListOrdered,
  Globe,
  Merge,
  type LucideIcon,
} from "lucide-react";

export interface NodeRegistryEntry {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  description: string;
  hasTargetHandle: boolean;
}

export const nodeRegistry: Record<string, NodeRegistryEntry> = {
  query: {
    icon: Search,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-l-primary",
    label: "Query",
    description: "User input query",
    hasTargetHandle: false,
  },
  hyde: {
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-l-blue-500",
    label: "HyDE",
    description: "Hypothetical document generation",
    hasTargetHandle: true,
  },
  embedding: {
    icon: GitBranch,
    color: "text-pink-500",
    bgColor: "bg-pink-500/5",
    borderColor: "border-l-pink-500",
    label: "Embedding",
    description: "Text to vector embedding",
    hasTargetHandle: true,
  },
  retriever: {
    icon: Database,
    color: "text-orange-500",
    bgColor: "bg-orange-500/5",
    borderColor: "border-l-orange-500",
    label: "Retriever",
    description: "Vector similarity search",
    hasTargetHandle: true,
  },
  reranker: {
    icon: ArrowRightLeft,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/5",
    borderColor: "border-l-yellow-500",
    label: "Reranker",
    description: "Re-rank retrieved documents",
    hasTargetHandle: true,
  },
  judge: {
    icon: Scale,
    color: "text-red-500",
    bgColor: "bg-red-500/5",
    borderColor: "border-l-red-500",
    label: "Judge",
    description: "Evaluate relevance quality",
    hasTargetHandle: true,
  },
  llm: {
    icon: Cpu,
    color: "text-purple-500",
    bgColor: "bg-purple-500/5",
    borderColor: "border-l-purple-500",
    label: "LLM",
    description: "Generate text response",
    hasTargetHandle: true,
  },
  agent: {
    icon: Bot,
    color: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-l-green-500",
    label: "Agent",
    description: "Autonomous tool-using agent",
    hasTargetHandle: true,
  },
  evaluator: {
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-l-emerald-500",
    label: "Evaluator",
    description: "Evaluate pipeline quality with RAG metrics",
    hasTargetHandle: true,
  },
  queryRewriter: {
    icon: PenLine,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/5",
    borderColor: "border-l-indigo-500",
    label: "Query Rewriter",
    description: "Rewrite queries for better retrieval",
    hasTargetHandle: true,
  },
  router: {
    icon: Route,
    color: "text-amber-500",
    bgColor: "bg-amber-500/5",
    borderColor: "border-l-amber-500",
    label: "Router",
    description: "Route queries by complexity or type",
    hasTargetHandle: true,
  },
  contextCompressor: {
    icon: Shrink,
    color: "text-teal-500",
    bgColor: "bg-teal-500/5",
    borderColor: "border-l-teal-500",
    label: "Context Compressor",
    description: "Compress context to reduce cost and noise",
    hasTargetHandle: true,
  },
  contextOptimizer: {
    icon: ListOrdered,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/5",
    borderColor: "border-l-cyan-500",
    label: "Context Optimizer",
    description: "Reorder context to avoid lost-in-the-middle",
    hasTargetHandle: true,
  },
  webSearch: {
    icon: Globe,
    color: "text-sky-500",
    bgColor: "bg-sky-500/5",
    borderColor: "border-l-sky-500",
    label: "Web Search",
    description: "Fallback web search when retrieval fails",
    hasTargetHandle: true,
  },
  fusion: {
    icon: Merge,
    color: "text-violet-500",
    bgColor: "bg-violet-500/5",
    borderColor: "border-l-violet-500",
    label: "Fusion",
    description: "Merge results from multiple retrievers via RRF",
    hasTargetHandle: true,
  },
};

export const nodeTypes = Object.keys(nodeRegistry);

export function getNodeConfigSummary(
  type: string,
  config?: Record<string, unknown>
): string {
  if (!config) return "";
  switch (type) {
    case "query":
      return "";
    case "hyde":
      return `${config.model ?? "gpt-4-turbo"} | ${config.maxTokens ?? 256} tokens`;
    case "embedding":
      return `${config.model ?? "text-embedding-3-small"} | ${config.dimensions ?? 1536}d`;
    case "retriever":
      return `top-${config.topK ?? 5} | threshold ${config.similarityThreshold ?? 0.8}`;
    case "reranker":
      return `top-${config.topN ?? 3} | ${config.model ?? "cross-encoder"}`;
    case "judge":
      return `${config.criteria ?? "relevance"} | ${config.confidenceThreshold ?? 0.85}`;
    case "llm":
      return `${config.model ?? "gpt-4-turbo"} | temp ${config.temperature ?? 0.7}`;
    case "agent":
      return `${config.model ?? "gpt-4-turbo"} | ${config.maxIterations ?? 5} iters`;
    case "evaluator":
      return `${config.metric ?? "faithfulness"} | ${config.model ?? "gpt-4o-mini"}`;
    case "queryRewriter":
      return `${config.strategy ?? "step-back"} | ${config.model ?? "gpt-4-turbo"}`;
    case "router":
      return `${config.strategy ?? "complexity"} | ${config.branches ?? 3} branches`;
    case "contextCompressor":
      return `${config.method ?? "llmlingua"} | ${config.ratio ?? "10x"}`;
    case "contextOptimizer":
      return `${config.strategy ?? "relevance-first"}`;
    case "webSearch":
      return `${config.provider ?? "tavily"} | top-${config.maxResults ?? 3}`;
    case "fusion":
      return `${config.method ?? "rrf"} | ${config.sources ?? 2} sources`;
    default:
      return "";
  }
}
