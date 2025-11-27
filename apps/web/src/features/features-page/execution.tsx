import { Play, Cpu, FileJson, Zap, Shield, Check } from "lucide-react";
import { FeaturePoint } from "./shared";

export function ExecutionSection() {
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
              This isn&apos;t a simulation. Run actual LLM calls against real embedding models
              with your documents. See real latency, real costs, and real results.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<Cpu className="size-4" />}
                title="Real API calls"
                description="Execute against OpenAI, Anthropic, Cohere, or your own models. Real tokens, real responses."
              />
              <FeaturePoint
                icon={<FileJson className="size-4" />}
                title="Your own data"
                description="Upload your documents or connect to your vector store. Test against your actual use case."
              />
              <FeaturePoint
                icon={<Zap className="size-4" />}
                title="Streaming results"
                description="Watch results stream in via SSE. See progress through each node as it executes."
              />
              <FeaturePoint
                icon={<Shield className="size-4" />}
                title="Safe experimentation"
                description="Experiment freely without affecting production. Your API keys stay local, never sent to our servers."
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
}

function ExecutionDemo() {
  return (
    <div className="h-96 rounded-2xl border bg-muted/30 overflow-hidden shadow-xl relative">
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
        <ExecutionStep status="complete" name="Query" time="2ms" detail="Input received" />
        <ExecutionStep status="complete" name="HyDE" time="890ms" detail="Generated hypothetical document" />
        <ExecutionStep status="complete" name="Embedding" time="124ms" detail="text-embedding-3-small" />
        <ExecutionStep status="complete" name="Retriever" time="67ms" detail="Retrieved 5 documents from Pinecone" />
        <ExecutionStep status="running" name="Reranker" time="..." detail="Reranking with cohere-rerank-v3" />
        <ExecutionStep status="pending" name="LLM" time="-" detail="Waiting..." />
        <ExecutionStep status="pending" name="Output" time="-" detail="Waiting..." />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t bg-background/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total time: <span className="text-foreground font-medium">1.08s</span></span>
          <span className="text-muted-foreground">Est. cost: <span className="text-foreground font-medium">$0.002</span></span>
        </div>
      </div>
    </div>
  );
}

function ExecutionStep({
  status,
  name,
  time,
  detail,
}: {
  status: "complete" | "running" | "pending";
  name: string;
  time: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">
        {status === "complete" && (
          <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="size-3 text-emerald-500" />
          </div>
        )}
        {status === "running" && (
          <div className="size-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
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
          <span className={`text-xs ${status === "complete" ? "text-emerald-500" : "text-muted-foreground"}`}>
            {time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
    </div>
  );
}
