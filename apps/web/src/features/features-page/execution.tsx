import { Play, Check } from "lucide-react";
import { FeaturePoint } from "./shared";

export const ExecutionSection = () => {
  return (
    <section id="execution" className="py-20 px-6 bg-white scroll-mt-16">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          {/* Text */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center justify-center size-10 rounded-lg border border-black/[0.06] text-orange-500 mb-5">
              <Play className="size-5" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
              Real Execution
            </h2>
            <p className="text-[15px] text-black/40 mb-8 leading-relaxed">
              Not a simulation. Execute against real APIs with your documents.
              See actual latency, token counts, and costs.
            </p>

            <div className="space-y-5">
              <FeaturePoint
                title="Real API calls"
                description="OpenAI, Anthropic, Cohere, or any OpenAI-compatible API (Azure, Ollama)."
              />
              <FeaturePoint
                title="Parallel execution"
                description="Nodes without dependencies run concurrently. HyDE and direct retrieval execute simultaneously."
              />
              <FeaturePoint
                title="Streaming + SSE"
                description="Watch LLM output stream in real-time. See progress through each node."
              />
              <FeaturePoint
                title="Automatic retries"
                description="Exponential backoff for transient failures. Circuit breaker for consistently failing nodes."
              />
              <FeaturePoint
                title="Zero-knowledge security"
                description="API keys stored in browser localStorage with AES-256. Never sent to our servers."
              />
            </div>
          </div>

          {/* Demo */}
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <Play className="size-3.5 text-orange-500" />
                <span className="text-[12px] font-medium text-black/70">Execution Log</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-orange-500">
                <div className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                Running
              </div>
            </div>

            {/* Steps */}
            <div className="p-5 text-[12px] space-y-3">
              {[
                { status: "done", name: "Query", time: "2ms", detail: "Input received", tokens: 12 },
                { status: "done", name: "HyDE", time: "890ms", detail: "gpt-4o-mini", tokens: 247, cost: "$0.0003" },
                { status: "done", name: "Embedding", time: "124ms", detail: "text-embedding-3-small", tokens: 312, cost: "$0.00006" },
                { status: "done", name: "Retriever", time: "67ms", detail: "Pinecone (5 docs, k=10)" },
                { status: "running", name: "Reranker", time: "...", detail: "cohere-rerank-v3" },
                { status: "pending", name: "LLM", time: "-", detail: "gpt-4o" },
                { status: "pending", name: "Output", time: "-", detail: "Waiting..." },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {step.status === "done" && (
                    <div className="size-4 rounded-full flex items-center justify-center bg-emerald-500/10">
                      <Check className="size-2.5 text-emerald-600" strokeWidth={3} />
                    </div>
                  )}
                  {step.status === "running" && (
                    <div className="size-4 rounded-full border-[1.5px] border-orange-400 border-t-transparent animate-spin" />
                  )}
                  {step.status === "pending" && (
                    <div className="size-4 rounded-full border border-black/[0.08]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={step.status === "pending" ? "text-black/20" : "text-black/70 font-medium"}>
                        {step.name}
                      </span>
                      <div className="flex items-center gap-3 text-[11px]">
                        {step.tokens && <span className="text-black/20">{step.tokens} tok</span>}
                        {step.cost && <span className="text-emerald-600">{step.cost}</span>}
                        <span className={`w-12 text-right tabular-nums ${step.status === "done" ? "text-emerald-600" : "text-black/20"}`}>
                          {step.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-black/20 truncate">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.06] bg-black/[0.01]">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-black/25">Time: <span className="text-black/70 font-medium tabular-nums">1.08s</span></span>
                <span className="text-black/25">Tokens: <span className="text-black/70 font-medium tabular-nums">571</span></span>
              </div>
              <span className="text-[11px] text-black/25">Est. cost: <span className="text-emerald-600 font-medium tabular-nums">$0.00036</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
