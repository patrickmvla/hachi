import {
  Search,
  FileText,
  GitBranch,
  Database,
  ArrowRightLeft,
  Scale,
  Cpu,
  Bot,
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
    default:
      return "";
  }
}
