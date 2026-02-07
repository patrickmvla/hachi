import { Play, Cpu, Zap, Shield, Check, GitBranch, RefreshCw } from "lucide-react";
import { FeaturePoint } from "./shared";

export const ExecutionSection = () => {
  return (
    <section id="execution" className="py-24 px-6 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-orange-500/10 text-orange-500 mb-6">
              <Play className="size-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real Execution</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Not a simulation. Execute against real APIs with your documents.
              See actual latency, token counts, and costs. P50: 1.2s, P99: 3.4s.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<Cpu className="size-4" />}
                title="Real API calls"
                description="Execute against OpenAI, Anthropic, Cohere, or OpenAI-compatible APIs (Azure, local LLMs via Ollama)."
              />
              <FeaturePoint
                icon={<GitBranch className="size-4" />}
                title="Parallel execution"
                description="Nodes without dependencies run concurrently. HyDE and direct retrieval execute simultaneously."
              />
              <FeaturePoint
                icon={<Zap className="size-4" />}
                title="Streaming + SSE"
                description="Watch LLM output stream in real-time. Progress through each node as it executes."
              />
              <FeaturePoint
                icon={<RefreshCw className="size-4" />}
                title="Automatic retries"
                description="Exponential backoff for transient failures. Circuit breaker for consistently failing nodes."
              />
              <FeaturePoint
                icon={<Shield className="size-4" />}
                title="Zero-knowledge security"
                description="API keys stored in browser localStorage with AES-256. Never sent to our servers. Audit our code."
              />
            </div>
          </div>

          <div className="relative">
            <ExecutionDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

const ExecutionDemo = () => {
  return (
    <div className="h-[420px] rounded-2xl border bg-muted/30 overflow-hidden shadow-xl relative">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="size-4 text-orange-500" />
          <span className="font-medium text-sm">Execution Log</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Running</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-3">
        <ExecutionStep status="complete" name="Query" time="2ms" detail="Input received" tokens={12} />
        <ExecutionStep status="complete" name="HyDE" time="890ms" detail="gpt-4o-mini" tokens={247} cost={0.0003} />
        <ExecutionStep status="complete" name="Embedding" time="124ms" detail="text-embedding-3-small" tokens={312} cost={0.00006} />
        <ExecutionStep status="complete" name="Retriever" time="67ms" detail="Pinecone (5 docs, k=10)" />
        <ExecutionStep status="running" name="Reranker" time="..." detail="cohere-rerank-v3" />
        <ExecutionStep status="pending" name="LLM" time="-" detail="gpt-4o" />
        <ExecutionStep status="pending" name="Output" time="-" detail="Waiting..." />
      </div>

      {/* Footer with metrics */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t bg-background/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Time: <span className="text-foreground font-medium">1.08s</span></span>
            <span className="text-muted-foreground">Tokens: <span className="text-foreground font-medium">571</span></span>
          </div>
          <span className="text-muted-foreground">Est. cost: <span className="text-green-500 font-medium">$0.00036</span></span>
        </div>
      </div>
    </div>
  );
};

const ExecutionStep = ({
  status,
  name,
  time,
  detail,
  tokens,
  cost,
}: {
  status: "complete" | "running" | "pending";
  name: string;
  time: string;
  detail: string;
  tokens?: number;
  cost?: number;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">
        {status === "complete" && (
          <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="size-3 text-emerald-500" />
          </div>
        )}
        {status === "running" && (
          <div className="size-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        )}
        {status === "pending" && (
          <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`font-medium text-sm ${status === "pending" ? "text-muted-foreground" : ""}`}>
            {name}
          </span>
          <div className="flex items-center gap-3 text-xs">
            {tokens && <span className="text-muted-foreground">{tokens} tok</span>}
            {cost && <span className="text-green-500">${cost.toFixed(5)}</span>}
            <span className={`${status === "complete" ? "text-emerald-500" : "text-muted-foreground"} w-14 text-right`}>
              {time}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
    </div>
  );
};
