import {
  MessageSquare,
  Database,
  Cpu,
  Box,
  Lightbulb,
  Search,
  RefreshCw,
  GitFork,
  Scale,
  Bot,
  Globe,
  ArrowRight,
} from "lucide-react";

// Shared node component
const Node = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) => {
  const colors: Record<string, string> = {
    blue: "border-blue-500/50 bg-blue-500/10 text-blue-500",
    green: "border-green-500/50 bg-green-500/10 text-green-500",
    purple: "border-purple-500/50 bg-purple-500/10 text-purple-500",
    orange: "border-orange-500/50 bg-orange-500/10 text-orange-500",
    yellow: "border-yellow-500/50 bg-yellow-500/10 text-yellow-500",
    pink: "border-pink-500/50 bg-pink-500/10 text-pink-500",
    cyan: "border-cyan-500/50 bg-cyan-500/10 text-cyan-500",
    red: "border-red-500/50 bg-red-500/10 text-red-500",
  };

  return (
    <div className={`flex flex-col items-center gap-1`}>
      <div className={`p-2 rounded-lg border-2 ${colors[color]} shadow-sm`}>
        <Icon className="size-4" />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
};

const Arrow = () => {
  return <ArrowRight className="size-3 text-muted-foreground/50 shrink-0" />;
};

// Naive RAG: Query → Retriever → LLM → Output
export const NaiveRAGDiagram = () => {
  return (
    <div className="flex items-center gap-2">
      <Node icon={MessageSquare} label="Query" color="blue" />
      <Arrow />
      <Node icon={Database} label="Retriever" color="green" />
      <Arrow />
      <Node icon={Cpu} label="LLM" color="purple" />
      <Arrow />
      <Node icon={Box} label="Output" color="orange" />
    </div>
  );
};

// HyDE: Query → HyDE → Retriever → LLM → Output
export const HyDEDiagram = () => {
  return (
    <div className="flex items-center gap-2">
      <Node icon={MessageSquare} label="Query" color="blue" />
      <Arrow />
      <Node icon={Lightbulb} label="HyDE" color="yellow" />
      <Arrow />
      <Node icon={Database} label="Retriever" color="green" />
      <Arrow />
      <Node icon={Cpu} label="LLM" color="purple" />
      <Arrow />
      <Node icon={Box} label="Output" color="orange" />
    </div>
  );
};

// Hybrid Search: Query → [BM25 + Vector] → Fusion → Reranker → LLM
export const HybridSearchDiagram = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Node icon={MessageSquare} label="Query" color="blue" />
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <ArrowRight className="size-3 text-muted-foreground/50 rotate-90 mb-1" />
          <Node icon={Search} label="BM25" color="cyan" />
        </div>
        <div className="flex flex-col items-center">
          <ArrowRight className="size-3 text-muted-foreground/50 rotate-90 mb-1" />
          <Node icon={Database} label="Vector" color="green" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Node icon={GitFork} label="Fusion" color="purple" />
        <Arrow />
        <Node icon={RefreshCw} label="Rerank" color="pink" />
        <Arrow />
        <Node icon={Cpu} label="LLM" color="purple" />
      </div>
    </div>
  );
};

// CRAG: Query → Retriever → Judge → [LLM or Web Search → LLM]
export const CRAGDiagram = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Node icon={MessageSquare} label="Query" color="blue" />
        <Arrow />
        <Node icon={Database} label="Retriever" color="green" />
        <Arrow />
        <Node icon={Scale} label="Judge" color="orange" />
      </div>
      <div className="flex items-center gap-6 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-emerald-500">relevant</span>
          <ArrowRight className="size-3 text-emerald-500/50" />
          <Node icon={Cpu} label="LLM" color="purple" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-red-500">irrelevant</span>
          <ArrowRight className="size-3 text-red-500/50" />
          <Node icon={Globe} label="Web" color="cyan" />
          <Arrow />
          <Node icon={Cpu} label="LLM" color="purple" />
        </div>
      </div>
    </div>
  );
};

// Parent-Child: Query → Child Retriever → Parent Lookup → LLM
export const ParentChildDiagram = () => {
  return (
    <div className="flex items-center gap-2">
      <Node icon={MessageSquare} label="Query" color="blue" />
      <Arrow />
      <div className="flex flex-col items-center gap-1">
        <Node icon={Database} label="Child" color="green" />
        <span className="text-[8px] text-muted-foreground">small chunks</span>
      </div>
      <Arrow />
      <div className="flex flex-col items-center gap-1">
        <Node icon={GitFork} label="Parent" color="purple" />
        <span className="text-[8px] text-muted-foreground">full context</span>
      </div>
      <Arrow />
      <Node icon={Cpu} label="LLM" color="purple" />
      <Arrow />
      <Node icon={Box} label="Output" color="orange" />
    </div>
  );
};

// Agentic RAG: Agent loop with retrieval tool
export const AgenticRAGDiagram = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Node icon={MessageSquare} label="Query" color="blue" />
      <ArrowRight className="size-3 text-muted-foreground/50 rotate-90" />
      <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5">
        <Node icon={Bot} label="Agent" color="purple" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <ArrowRight className="size-2 text-muted-foreground/50" />
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">search()</div>
          </div>
          <div className="flex items-center gap-1">
            <ArrowRight className="size-2 text-muted-foreground/50" />
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">think()</div>
          </div>
          <div className="flex items-center gap-1">
            <ArrowRight className="size-2 text-muted-foreground/50" />
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600">answer()</div>
          </div>
        </div>
      </div>
      <ArrowRight className="size-3 text-muted-foreground/50 rotate-90" />
      <Node icon={Box} label="Output" color="orange" />
    </div>
  );
};
