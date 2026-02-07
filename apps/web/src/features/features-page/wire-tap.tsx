import { Eye, Database, MessageSquare, Clock, Copy, DollarSign } from "lucide-react";
import { FeaturePoint } from "./shared";

export const WireTapSection = () => {
  return (
    <section id="wiretap" className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <WireTapDemo />
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6">
              <Eye className="size-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Wire Tap Debugging</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Click any connection to inspect data in flight. See why doc_0 scored 0.94 while doc_3 scored 0.31.
              Track costs, tokens, and latency per step.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<Eye className="size-4" />}
                title="Inspect any connection"
                description="Click on any wire to see exact data. Compare embedding vectors side-by-side. No more print debugging."
              />
              <FeaturePoint
                icon={<Database className="size-4" />}
                title="Embeddings and scores"
                description="View actual vectors and similarity scores. See why certain documents rank higher than others."
              />
              <FeaturePoint
                icon={<DollarSign className="size-4" />}
                title="Cost tracking per step"
                description="Know exactly what each node costs. $0.0001 for embedding, $0.002 for LLM. Optimize your budget."
              />
              <FeaturePoint
                icon={<Clock className="size-4" />}
                title="Latency breakdown"
                description="Reranker: 2.3s. Retrieval: 67ms. LLM: 1.4s. Know exactly where to optimize."
              />
            </div>

            {/* Export capabilities */}
            <div className="mt-8 p-4 rounded-lg bg-background border border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Export traces</span> as OpenTelemetry-compatible JSON.
                Track 15+ metrics: latency, tokens, cost, similarity scores, confidence intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WireTapDemo = () => {
  return (
    <div className="h-[420px] rounded-2xl border bg-muted/30 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-emerald-500" />
          <span className="font-medium text-sm">Wire Tap: Retriever → Reranker</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="size-3" />
            Copy JSON
          </button>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 font-mono text-xs overflow-auto h-[calc(100%-48px)]">
        {/* Documents */}
        <div>
          <p className="text-muted-foreground mb-1">// Input from Retriever (5 documents)</p>
          <div className="p-3 rounded-lg bg-background border">
            <p><span className="text-purple-400">documents</span>: [</p>
            <p className="pl-4"><span className="text-green-400">&quot;RAG combines retrieval with generation...&quot;</span>,</p>
            <p className="pl-4"><span className="text-green-400">&quot;Vector embeddings capture semantic...&quot;</span>,</p>
            <p className="pl-4"><span className="text-green-400">&quot;The retriever component searches...&quot;</span>,</p>
            <p className="pl-4 text-muted-foreground">// +2 more documents</p>
            <p>]</p>
          </div>
        </div>

        {/* Similarity scores */}
        <div>
          <p className="text-muted-foreground mb-1">// Similarity scores (cosine)</p>
          <div className="p-3 rounded-lg bg-background border space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-16">doc_0:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "94%" }} />
              </div>
              <span className="text-emerald-400 w-12 text-right font-semibold">0.94</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-16">doc_1:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/80" style={{ width: "87%" }} />
              </div>
              <span className="text-emerald-400/80 w-12 text-right">0.87</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-16">doc_2:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/60" style={{ width: "72%" }} />
              </div>
              <span className="text-emerald-400/60 w-12 text-right">0.72</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-16">doc_3:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-orange-500/60" style={{ width: "31%" }} />
              </div>
              <span className="text-orange-400/60 w-12 text-right">0.31</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <p className="text-muted-foreground mb-1">// Metrics</p>
          <div className="p-3 rounded-lg bg-background border grid grid-cols-2 gap-2">
            <p><span className="text-orange-400">latency</span>: <span className="text-blue-400">156ms</span></p>
            <p><span className="text-orange-400">tokens</span>: <span className="text-blue-400">847</span></p>
            <p><span className="text-orange-400">cost</span>: <span className="text-green-400">$0.00017</span></p>
            <p><span className="text-orange-400">model</span>: <span className="text-green-400">&quot;text-embedding-3-small&quot;</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
