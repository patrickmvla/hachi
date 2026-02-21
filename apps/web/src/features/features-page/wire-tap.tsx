import { Eye, Check } from "lucide-react";
import { FeaturePoint } from "./shared";

export const WireTapSection = () => {
  return (
    <section id="wiretap" className="py-20 px-6 bg-[#fafafa] scroll-mt-16">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-[1000px] mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Demo */}
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <Eye className="size-3.5 text-emerald-600" />
                <span className="text-[12px] font-medium text-black/70">Wire Tap: Retriever &rarr; Reranker</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-black/30">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            {/* Content */}
            <div className="p-5 text-[12px] space-y-4">
              {/* Documents */}
              <div>
                <p className="text-black/25 mb-2">// Input from Retriever (5 documents)</p>
                <div className="p-3 rounded-lg border border-black/[0.04] bg-black/[0.01] space-y-1">
                  <p><span className="text-violet-600">documents</span>: [</p>
                  <p className="pl-4 text-emerald-700">&quot;RAG combines retrieval with generation...&quot;</p>
                  <p className="pl-4 text-emerald-700">&quot;Vector embeddings capture semantic...&quot;</p>
                  <p className="pl-4 text-emerald-700">&quot;The retriever component searches...&quot;</p>
                  <p className="pl-4 text-black/20">// +2 more documents</p>
                  <p>]</p>
                </div>
              </div>

              {/* Scores */}
              <div>
                <p className="text-black/25 mb-2">// Similarity scores (cosine)</p>
                <div className="p-3 rounded-lg border border-black/[0.04] bg-black/[0.01] space-y-2">
                  {[
                    { id: "doc_0", score: 0.94, pct: 94 },
                    { id: "doc_1", score: 0.87, pct: 87 },
                    { id: "doc_2", score: 0.72, pct: 72 },
                    { id: "doc_3", score: 0.31, pct: 31, low: true },
                  ].map((d) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <span className="text-black/25 w-12">{d.id}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-black/[0.04]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${d.pct}%`,
                            backgroundColor: d.low ? "#f97316" : "#059669",
                            opacity: d.low ? 0.7 : 1 - (94 - d.pct) * 0.02,
                          }}
                        />
                      </div>
                      <span className={`w-8 text-right tabular-nums ${d.low ? "text-orange-500" : "text-emerald-600"}`}>
                        {d.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-3 p-3 rounded-lg border border-black/[0.04] bg-black/[0.01]">
                <div>
                  <div className="text-black/20 text-[10px] mb-0.5">latency</div>
                  <div className="text-black/70 font-medium tabular-nums">156ms</div>
                </div>
                <div>
                  <div className="text-black/20 text-[10px] mb-0.5">tokens</div>
                  <div className="text-black/70 font-medium tabular-nums">847</div>
                </div>
                <div>
                  <div className="text-black/20 text-[10px] mb-0.5">cost</div>
                  <div className="text-emerald-600 font-medium tabular-nums">$0.00017</div>
                </div>
                <div>
                  <div className="text-black/20 text-[10px] mb-0.5">model</div>
                  <div className="text-black/70 font-medium text-[10px]">embed-3-small</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center justify-center size-10 rounded-lg border border-black/[0.06] text-emerald-600 mb-5">
              <Eye className="size-5" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
              Wire Tap Debugging
            </h2>
            <p className="text-[15px] text-black/40 mb-8 leading-relaxed">
              Click any connection to inspect data in flight. See why doc_0 scored 0.94 while doc_3 scored 0.31.
              Track costs, tokens, and latency per step.
            </p>

            <div className="space-y-5">
              <FeaturePoint
                title="Inspect any connection"
                description="Click any wire to see exact data flowing through. Compare embedding vectors side-by-side."
              />
              <FeaturePoint
                title="Embeddings and scores"
                description="View actual vectors and similarity scores. See why certain documents rank higher."
              />
              <FeaturePoint
                title="Cost tracking per step"
                description="$0.0001 for embedding, $0.002 for LLM. Know exactly what each node costs."
              />
              <FeaturePoint
                title="Latency breakdown"
                description="Reranker: 2.3s. Retrieval: 67ms. LLM: 1.4s. Know exactly where to optimize."
              />
            </div>

            <div className="mt-8 p-4 rounded-xl border border-black/[0.06] bg-black/[0.02]">
              <p className="text-[13px] text-black/40">
                <span className="text-black/70 font-medium">Export traces</span> as OpenTelemetry-compatible JSON.
                Track 15+ metrics per execution step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
