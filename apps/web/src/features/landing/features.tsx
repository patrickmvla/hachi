import { Workflow, Eye, Play, Users, Check, Box, ArrowRight, Database, Cpu, MessageSquare } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Engineering tools for RAG architecture
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Not a low-code builder. A platform for understanding complex systems.
          </p>
        </div>

        <div className="grid gap-24">
          {/* Visual Canvas */}
          <FeatureRow
            icon={<Workflow className="size-6" />}
            title="Visual Canvas"
            description="Design advanced RAG architectures by connecting nodes. Drag HyDE, Retriever, Reranker, and Judge nodes. Wire them together. See the data flow."
            highlights={[
              "Typed connections prevent invalid wiring",
              "Nodes represent real RAG patterns",
              "Export to code when ready",
            ]}
            visual={<CanvasVisual />}
          />

          {/* Wire Tap */}
          <FeatureRow
            icon={<Eye className="size-6" />}
            title="Wire Tap Debugging"
            description="Click any connection to see the exact data flowing through. Stop guessing why retrieval failed - see the embeddings, the similarity scores, the Judge's reasoning."
            highlights={[
              "Inspect every step's input and output",
              "See embedding vectors and scores",
              "Understand why the LLM hallucinated",
            ]}
            visual={<WireTapVisual />}
            reverse
          />

          {/* Real Execution */}
          <FeatureRow
            icon={<Play className="size-6" />}
            title="Real Execution"
            description="Not a simulation. Run actual LLM calls, real embeddings, against your documents. See real latency. Experience real failures - and understand them."
            highlights={[
              "Actual API calls to your models",
              "Your own documents and data",
              "SSE streaming shows progress live",
            ]}
            visual={<ExecutionVisual />}
          />

          {/* Collaboration */}
          <FeatureRow
            icon={<Users className="size-6" />}
            title="Real-time Collaboration"
            description="Build architectures together. Senior engineers can demonstrate patterns while the team watches. Debug together. Shared Wire Tap means shared understanding."
            highlights={[
              "Live cursors show who's working where",
              "Changes sync instantly",
              "Shared execution results",
            ]}
            visual={<CollaborationVisual />}
            reverse
          />
        </div>
      </div>
    </section>
  );
};

const FeatureRow = ({
  icon,
  title,
  description,
  highlights,
  visual,
  reverse = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) => {
  return (
    <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}>
      <div className="flex-1 max-w-xl">
        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-6">
          {icon}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="size-3 text-primary" />
              </div>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">
        {visual}
      </div>
    </div>
  );
};

const CanvasVisual = () => {
  return (
    <div className="relative h-72 lg:h-80 rounded-2xl border bg-muted/30 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      <div className="relative h-full flex items-center justify-center gap-4">
        {/* Query Node */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-3 rounded-lg border-2 border-blue-500/50 bg-blue-500/10 shadow-lg">
            <MessageSquare className="size-5 text-blue-500" />
          </div>
          <span className="text-xs text-muted-foreground">Query</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground" />
        {/* Retriever Node */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-3 rounded-lg border-2 border-green-500/50 bg-green-500/10 shadow-lg">
            <Database className="size-5 text-green-500" />
          </div>
          <span className="text-xs text-muted-foreground">Retriever</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground" />
        {/* LLM Node */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-3 rounded-lg border-2 border-purple-500/50 bg-purple-500/10 shadow-lg">
            <Cpu className="size-5 text-purple-500" />
          </div>
          <span className="text-xs text-muted-foreground">LLM</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground" />
        {/* Output Node */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-3 rounded-lg border-2 border-orange-500/50 bg-orange-500/10 shadow-lg">
            <Box className="size-5 text-orange-500" />
          </div>
          <span className="text-xs text-muted-foreground">Output</span>
        </div>
      </div>
    </div>
  );
};

const WireTapVisual = () => {
  return (
    <div className="h-72 lg:h-80 rounded-2xl border bg-muted/30 p-6 overflow-hidden">
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Eye className="size-4 text-primary" />
          Wire Inspector
        </div>
        <div className="flex-1 rounded-lg border bg-background p-4 font-mono text-xs space-y-3 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">input:</span>
            <span className="text-blue-400">&quot;How does RAG work?&quot;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">embeddings:</span>
            <span className="text-green-400">[0.123, -0.456, 0.789, ...]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">top_k:</span>
            <span className="text-orange-400">5</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">scores:</span>
            <div className="pl-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 rounded-full bg-primary" />
                <span className="text-primary">0.94</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-primary/70" />
                <span className="text-primary/70">0.87</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-primary/50" />
                <span className="text-primary/50">0.72</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExecutionVisual = () => {
  return (
    <div className="h-72 lg:h-80 rounded-2xl border bg-muted/30 p-6 overflow-hidden">
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Play className="size-4 text-primary" />
            Execution Log
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </div>
        </div>
        <div className="flex-1 rounded-lg border bg-background p-4 font-mono text-xs space-y-2 overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="size-3" />
            Query node completed (12ms)
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="size-3" />
            Embedding generated (89ms)
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="size-3" />
            Retrieved 5 documents (156ms)
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <div className="size-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            LLM generating response...
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-3" />
            Pending: Output formatting
          </div>
        </div>
      </div>
    </div>
  );
};

const CollaborationVisual = () => {
  return (
    <div className="relative h-72 lg:h-80 rounded-2xl border bg-muted/30 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      {/* Cursor 1 */}
      <div className="absolute top-16 left-20 flex items-start gap-1 animate-pulse">
        <svg width="12" height="18" viewBox="0 0 12 18" className="text-blue-500">
          <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
        </svg>
        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Alice</span>
      </div>
      {/* Cursor 2 */}
      <div className="absolute top-32 right-24 flex items-start gap-1">
        <svg width="12" height="18" viewBox="0 0 12 18" className="text-purple-500">
          <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
        </svg>
        <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded">Bob</span>
      </div>
      {/* Selection highlight */}
      <div className="absolute top-24 left-32 w-32 h-16 border-2 border-dashed border-blue-500/50 rounded-lg bg-blue-500/5" />
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="size-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-xs text-white font-medium">A</div>
            <div className="size-8 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-xs text-white font-medium">B</div>
            <div className="size-8 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-xs text-white font-medium">C</div>
          </div>
          <span className="text-xs text-muted-foreground">3 collaborators</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-500">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Synced
        </div>
      </div>
    </div>
  );
};
