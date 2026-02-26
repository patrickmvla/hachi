import {
  Search,
  FileText,
  GitBranch,
  Database,
  ArrowRightLeft,
  Scale,
  Cpu,
  Play,
  Loader2,
  Layers,
  Shuffle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { FeaturePoint, DetailCard } from "./shared";

const EXEC_NODES = [
  { label: "Query", icon: Search, color: "#2563eb", status: "done" as const },
  { label: "HyDE", icon: FileText, color: "#3b82f6", status: "done" as const },
  { label: "Embedding", icon: GitBranch, color: "#ec4899", status: "done" as const },
  { label: "Retriever", icon: Database, color: "#f97316", status: "done" as const },
  { label: "Reranker", icon: ArrowRightLeft, color: "#eab308", status: "running" as const },
  { label: "Judge", icon: Scale, color: "#ef4444", status: "pending" as const },
  { label: "LLM", icon: Cpu, color: "#a855f7", status: "pending" as const },
];

export const ExecutionSection = () => {
  return (
    <section id="execution" className="py-24 sm:py-32 px-6 bg-white scroll-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
              Execution
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-[1.15] text-black mb-4">
              Not a simulation.
              <br />
              Real API calls.
            </h2>
            <p className="text-[15px] leading-relaxed text-black/40 mb-8">
              When you press Run, hachi calls your actual LLM and vector store APIs with your credentials. Real tokens, real latency, real results — not a sandbox mockup.
            </p>
            <div className="space-y-4">
              <FeaturePoint
                title="Your models, your keys"
                description="Bring your own OpenAI, Anthropic, or Cohere API keys. Your credentials, your data."
              />
              <FeaturePoint
                title="Parallel execution"
                description="Independent branches run concurrently. Topological sort ensures correct dependency order."
              />
              <FeaturePoint
                title="Streaming via SSE"
                description="Results stream back in real-time via server-sent events. Watch nodes complete live."
              />
              <FeaturePoint
                title="Automatic retries"
                description="Rate limits and transient failures are retried with exponential backoff. No lost runs."
              />
            </div>
          </div>

          {/* Mockup column */}
          <div>
            <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                </div>
                <span className="text-[11px] text-black/30 tracking-wide">
                  crag-pipeline.hachi
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-500">
                  <Loader2 className="size-3 animate-spin" />
                  executing
                </div>
              </div>

              {/* Execution bar */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.06] bg-black/[0.01]">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.04] text-[10px] text-black/30 font-medium cursor-not-allowed">
                  <Loader2 className="size-3 animate-spin" />
                  Running...
                </button>
                <div className="flex-1 px-3 py-1.5 rounded-lg border border-black/[0.06] bg-white">
                  <span className="text-[10px] text-black/40">
                    &quot;How does retrieval-augmented generation work?&quot;
                  </span>
                </div>
                <span className="text-[10px] text-blue-500 font-medium whitespace-nowrap hidden sm:block">
                  Reranking Results
                </span>
              </div>

              {/* Pipeline visualization */}
              <div className="relative px-4 sm:px-6 py-6 sm:py-8">
                <div
                  className="absolute inset-0 opacity-[0.3] pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative">
                  {/* Row 1: Query → HyDE → Embedding → Retriever */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-6">
                    {EXEC_NODES.slice(0, 4).map((node, i) => {
                      const Icon = node.icon;
                      return (
                        <div key={node.label} className="flex items-center gap-1 sm:gap-2 flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`size-10 sm:size-11 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                                node.status === "running" ? "ring-2 ring-blue-500/20" : ""
                              }`}
                              style={{
                                borderColor:
                                  node.status === "done"
                                    ? "#22c55e40"
                                    : node.status === "running"
                                    ? "#3b82f640"
                                    : "rgba(0,0,0,0.06)",
                              }}
                            >
                              <Icon
                                className="size-3.5"
                                style={{
                                  color:
                                    node.status === "pending"
                                      ? "rgba(0,0,0,0.2)"
                                      : node.color,
                                }}
                              />
                            </div>
                            <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-black/35 font-medium">
                              {node.label}
                            </span>
                            {node.status === "done" && (
                              <div className="size-1.5 rounded-full bg-emerald-500" />
                            )}
                            {node.status === "running" && (
                              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                            )}
                            {node.status === "pending" && (
                              <div className="size-1.5 rounded-full bg-black/10" />
                            )}
                          </div>
                          {i < 3 && (
                            <div className="flex-1 min-w-[8px] sm:min-w-[12px]">
                              <div
                                className="w-full h-[1.5px] rounded-full"
                                style={{
                                  backgroundColor: "#22c55e40",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 2: Reranker → Judge → LLM */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {EXEC_NODES.slice(4).map((node, i) => {
                      const Icon = node.icon;
                      return (
                        <div key={node.label} className="flex items-center gap-1 sm:gap-2 flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`size-10 sm:size-11 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                                node.status === "running" ? "ring-2 ring-blue-500/20" : ""
                              }`}
                              style={{
                                borderColor:
                                  node.status === "done"
                                    ? "#22c55e40"
                                    : node.status === "running"
                                    ? "#3b82f640"
                                    : "rgba(0,0,0,0.06)",
                              }}
                            >
                              <Icon
                                className="size-3.5"
                                style={{
                                  color:
                                    node.status === "pending"
                                      ? "rgba(0,0,0,0.2)"
                                      : node.color,
                                }}
                              />
                            </div>
                            <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-black/35 font-medium">
                              {node.label}
                            </span>
                            {node.status === "done" && (
                              <div className="size-1.5 rounded-full bg-emerald-500" />
                            )}
                            {node.status === "running" && (
                              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                            )}
                            {node.status === "pending" && (
                              <div className="size-1.5 rounded-full bg-black/10" />
                            )}
                          </div>
                          {i < 2 && (
                            <div className="flex-1 min-w-[8px] sm:min-w-[12px]">
                              <div
                                className="w-full h-[1.5px] rounded-full"
                                style={{
                                  backgroundColor:
                                    node.status === "done"
                                      ? "#22c55e40"
                                      : node.status === "running"
                                      ? "#3b82f640"
                                      : "rgba(0,0,0,0.08)",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] bg-black/[0.01]">
                <div className="flex items-center gap-3 text-[10px] text-black/30">
                  <span>elapsed: 1.85s</span>
                  <span>tokens: 2,847</span>
                </div>
                <span className="text-[10px] text-black/30">
                  est. cost: $0.0142
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail cards + mono */}
        <div className="mt-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <DetailCard
              icon={Layers}
              title="Topological execution"
              description="Nodes execute in dependency order. Parallel branches run concurrently for maximum throughput."
            />
            <DetailCard
              icon={Shuffle}
              title="Multi-provider"
              description="Mix OpenAI, Anthropic, and Cohere in the same pipeline. Each node uses its own provider."
            />
            <DetailCard
              icon={DollarSign}
              title="Cost tracking"
              description="Real-time token counting and cost estimation. Per-node and total pipeline cost breakdown."
            />
            <DetailCard
              icon={RefreshCw}
              title="Retry & fallback"
              description="Automatic retries with exponential backoff. Configure fallback models for resilience."
            />
          </div>
          <p className="mt-6 text-[12px] font-mono text-black/20">
            query:200ms → embed:350ms → retrieve:450ms → rerank:600ms → judge:800ms → llm:1.5s = 3.9s total
          </p>
        </div>
      </div>
    </section>
  );
};
