import {
  Search,
  GitBranch,
  Database,
  ArrowRightLeft,
  Eye,
  Check,
  Activity,
  DollarSign,
  Timer,
} from "lucide-react";
import { FeaturePoint, DetailCard } from "./shared";

const TIMELINE_ENTRIES = [
  { step: "Query Parse", time: "12ms", status: "done" as const },
  { step: "Embedding", time: "85ms", status: "done" as const },
  { step: "Retrieval", time: "156ms", status: "done" as const },
  { step: "Reranking", time: "210ms", status: "done" as const },
];

const JSON_PREVIEW = {
  documents: [
    { title: "RAG Overview", score: 0.94, tokens: 312 },
    { title: "Vector Search", score: 0.91, tokens: 287 },
    { title: "Embedding Models", score: 0.87, tokens: 245 },
  ],
};

export const WireTapSection = () => {
  return (
    <section id="wiretap" className="py-24 sm:py-32 px-6 bg-[#fafafa] scroll-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Mockup column */}
          <div className="space-y-4">
            {/* Main mockup: Canvas with wire tap panel */}
            <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                </div>
                <span className="text-[11px] text-black/30 tracking-wide">
                  wire-tap-debug.hachi
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-black/30">
                  <Eye className="size-3 text-emerald-500" />
                  inspecting
                </div>
              </div>

              <div className="flex">
                {/* Canvas with pipeline */}
                <div className="flex-1 relative p-5 sm:p-6">
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

                  <div className="relative flex items-center gap-2 sm:gap-3">
                    {[
                      { label: "Query", icon: Search, color: "#2563eb" },
                      { label: "Embed", icon: GitBranch, color: "#ec4899" },
                      { label: "Retriever", icon: Database, color: "#f97316" },
                      { label: "Reranker", icon: ArrowRightLeft, color: "#eab308" },
                    ].map((node, i) => {
                      const Icon = node.icon;
                      const isHighlighted = i === 2; // Wire between Retriever and Reranker
                      return (
                        <div key={node.label} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`size-10 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                                isHighlighted ? "ring-2 ring-blue-500/30" : ""
                              }`}
                              style={{ borderColor: `${node.color}30` }}
                            >
                              <Icon className="size-3.5" style={{ color: node.color }} />
                            </div>
                            <span className="text-[8px] uppercase tracking-wider text-black/35 font-medium">
                              {node.label}
                            </span>
                          </div>
                          {i < 3 && (
                            <div className="flex-1 min-w-[16px] relative">
                              <div
                                className={`w-full ${
                                  i === 2 ? "h-[3px] bg-blue-500/40" : "h-[1.5px] bg-black/[0.08]"
                                } rounded-full`}
                              />
                              {i === 2 && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                  <div className="bg-black text-white text-[8px] font-mono px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                                    5 docs · 0.94 · 156ms
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-black rotate-45 absolute -bottom-[3px] left-1/2 -translate-x-1/2" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wire Tap panel */}
                <div className="w-[160px] sm:w-[180px] border-l border-black/[0.06] p-3 shrink-0 hidden sm:block">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Eye className="size-3 text-black/40" />
                    <span className="text-[9px] uppercase tracking-wider text-black/30 font-medium">
                      Wire Tap
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {TIMELINE_ENTRIES.map((entry) => (
                      <div
                        key={entry.step}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md bg-black/[0.02]"
                      >
                        <div className="flex items-center gap-1.5">
                          <Check className="size-2.5 text-emerald-500" strokeWidth={3} />
                          <span className="text-[9px] text-black/50 font-medium">{entry.step}</span>
                        </div>
                        <span className="text-[8px] font-mono text-black/30">{entry.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.06]">
                    <div className="text-[8px] text-black/25 space-y-1">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-mono">463ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost</span>
                        <span className="font-mono">$0.0034</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] bg-black/[0.01]">
                <span className="text-[10px] text-black/30">
                  inspecting: retriever → reranker
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  5 documents captured
                </span>
              </div>
            </div>

            {/* JSON Viewer panel */}
            <div className="rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06]">
                <span className="text-[10px] text-black/40 font-medium">Retriever Output</span>
                <span className="text-[9px] text-black/20 font-mono">application/json</span>
              </div>
              <div className="px-3 py-2.5 font-mono text-[10px] leading-relaxed">
                <span className="text-black/20">{"{"}</span>
                <br />
                <span className="text-black/20">&nbsp;&nbsp;</span>
                <span className="text-blue-600">&quot;documents&quot;</span>
                <span className="text-black/20">: [</span>
                <br />
                {JSON_PREVIEW.documents.map((doc, i) => (
                  <div key={i}>
                    <span className="text-black/20">&nbsp;&nbsp;&nbsp;&nbsp;{"{"} </span>
                    <span className="text-blue-600">&quot;title&quot;</span>
                    <span className="text-black/20">: </span>
                    <span className="text-emerald-600">&quot;{doc.title}&quot;</span>
                    <span className="text-black/20">, </span>
                    <span className="text-blue-600">&quot;score&quot;</span>
                    <span className="text-black/20">: </span>
                    <span className="text-orange-600">{doc.score}</span>
                    <span className="text-black/20">, </span>
                    <span className="text-blue-600">&quot;tokens&quot;</span>
                    <span className="text-black/20">: </span>
                    <span className="text-orange-600">{doc.tokens}</span>
                    <span className="text-black/20">
                      {" }"}
                      {i < JSON_PREVIEW.documents.length - 1 ? "," : ""}
                    </span>
                  </div>
                ))}
                <span className="text-black/20">&nbsp;&nbsp;]</span>
                <br />
                <span className="text-black/20">{"}"}</span>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div>
            <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
              Wire Tap
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-[1.15] text-black mb-4">
              Click any wire.
              <br />
              See everything.
            </h2>
            <p className="text-[15px] leading-relaxed text-black/40 mb-8">
              Every connection is inspectable. Click a wire to see exactly what data flowed through it — documents, scores, embeddings, latency, and cost. No logging setup required.
            </p>
            <div className="space-y-4">
              <FeaturePoint
                title="Inspect any connection"
                description="Click any wire to see the full payload. Documents, vectors, scores — everything in structured JSON."
              />
              <FeaturePoint
                title="Embedding vector preview"
                description="Visualize high-dimensional vectors as sparklines. Spot drift and quality issues instantly."
              />
              <FeaturePoint
                title="Cost tracking per step"
                description="Every node reports token usage and estimated cost. See exactly where your budget goes."
              />
              <FeaturePoint
                title="Latency waterfall"
                description="Timeline view of every step. Identify bottlenecks in your pipeline at a glance."
              />
            </div>
          </div>
        </div>

        {/* Detail cards + mono */}
        <div className="mt-12">
          <div className="grid sm:grid-cols-3 gap-3">
            <DetailCard
              icon={Activity}
              title="Real-time streaming"
              description="Watch data flow through your pipeline live as each node completes. No refresh needed."
            />
            <DetailCard
              icon={DollarSign}
              title="Run comparison"
              description="Compare outputs between runs side-by-side. Track improvements across iterations."
            />
            <DetailCard
              icon={Timer}
              title="Export results"
              description="Export Wire Tap traces as JSON for automated testing and regression suites."
            />
          </div>
          <p className="mt-6 text-[12px] font-mono text-black/20">
            retriever → 5 docs · score: [0.94, 0.91, 0.87, 0.84, 0.81] · 450ms · $0.0002
          </p>
        </div>
      </div>
    </section>
  );
};
