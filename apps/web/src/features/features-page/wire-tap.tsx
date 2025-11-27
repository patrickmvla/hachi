import { Eye, Database, MessageSquare, Clock } from "lucide-react";
import { FeaturePoint } from "./shared";

export function WireTapSection() {
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
              Click any connection to inspect the data flowing through it. See embeddings,
              similarity scores, retrieved documents, and LLM reasoning - all in real time.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<Eye className="size-4" />}
                title="Inspect any connection"
                description="Click on any wire to see exactly what data is passing through. No more black boxes."
              />
              <FeaturePoint
                icon={<Database className="size-4" />}
                title="View embeddings and scores"
                description="See the actual embedding vectors and similarity scores. Understand why certain documents rank higher."
              />
              <FeaturePoint
                icon={<MessageSquare className="size-4" />}
                title="LLM reasoning trace"
                description="See the full prompt sent to the LLM and understand its reasoning process step by step."
              />
              <FeaturePoint
                icon={<Clock className="size-4" />}
                title="Timing breakdown"
                description="See how long each step takes. Identify bottlenecks and optimize your pipeline."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WireTapDemo() {
  return (
    <div className="h-96 rounded-2xl border bg-muted/30 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-emerald-500" />
          <span className="font-medium text-sm">Wire Tap: Retriever → Reranker</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 font-mono text-xs">
        <div>
          <p className="text-muted-foreground mb-1">// Input from Retriever</p>
          <div className="p-3 rounded-lg bg-background border">
            <p><span className="text-purple-400">documents</span>: [</p>
            <p className="pl-4"><span className="text-green-400">&quot;RAG combines retrieval with generation...&quot;</span>,</p>
            <p className="pl-4"><span className="text-green-400">&quot;Vector embeddings capture semantic...&quot;</span>,</p>
            <p className="pl-4"><span className="text-green-400">&quot;The retriever component searches...&quot;</span>,</p>
            <p className="pl-4 text-muted-foreground">// 2 more documents</p>
            <p>]</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">// Similarity scores</p>
          <div className="p-3 rounded-lg bg-background border space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-16">doc_0:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "94%" }} />
              </div>
              <span className="text-emerald-400 w-12 text-right">0.94</span>
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
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">// Metadata</p>
          <div className="p-3 rounded-lg bg-background border">
            <p><span className="text-orange-400">latency</span>: <span className="text-blue-400">156ms</span></p>
            <p><span className="text-orange-400">model</span>: <span className="text-green-400">&quot;text-embedding-3-small&quot;</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
