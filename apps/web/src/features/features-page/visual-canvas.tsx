import {
  Workflow,
  Layers,
  GitBranch,
  Search,
  Code2,
  MessageSquare,
  Database,
  Cpu,
  Box,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { FeaturePoint } from "./shared";

export function VisualCanvasSection() {
  return (
    <section id="canvas" className="py-24 px-6 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-blue-500/10 text-blue-500 mb-6">
              <Workflow className="size-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Visual Canvas</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Design complex RAG architectures visually. Drag nodes, connect them with typed wires,
              and see your pipeline take shape. No more whiteboard sketches that can&apos;t execute.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<Layers className="size-4" />}
                title="Drag-and-drop nodes"
                description="Choose from a library of RAG components: Query, Retriever, Reranker, LLM, and more. Each node encapsulates a real pattern."
              />
              <FeaturePoint
                icon={<GitBranch className="size-4" />}
                title="Typed connections"
                description="Connections are typed - you can't wire a text output to an embedding input. Catch errors before execution."
              />
              <FeaturePoint
                icon={<Search className="size-4" />}
                title="Zoom and pan"
                description="Navigate complex architectures with smooth zoom and pan. Fit large pipelines on any screen."
              />
              <FeaturePoint
                icon={<Code2 className="size-4" />}
                title="Export to code"
                description="When you're ready, export your visual architecture to production-ready Python or TypeScript code."
              />
            </div>
          </div>

          <div className="relative">
            <CanvasDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

function CanvasDemo() {
  return (
    <div className="relative h-96 rounded-2xl border bg-muted/30 p-6 overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

      {/* Nodes */}
      <div className="relative h-full">
        {/* Query Node */}
        <div className="absolute top-8 left-4 w-32">
          <div className="p-3 rounded-lg border-2 border-blue-500/50 bg-blue-500/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="size-4 text-blue-500" />
              <span className="text-sm font-medium">Query</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">&quot;How does...&quot;</div>
          </div>
          {/* Connection point */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3 rounded-full bg-blue-500 border-2 border-background" />
        </div>

        {/* HyDE Node */}
        <div className="absolute top-4 left-44 w-32">
          <div className="p-3 rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="size-4 text-yellow-500" />
              <span className="text-sm font-medium">HyDE</span>
            </div>
            <div className="text-xs text-muted-foreground">Expand query</div>
          </div>
        </div>

        {/* Retriever Node */}
        <div className="absolute top-24 left-44 w-32">
          <div className="p-3 rounded-lg border-2 border-green-500/50 bg-green-500/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="size-4 text-green-500" />
              <span className="text-sm font-medium">Retriever</span>
            </div>
            <div className="text-xs text-muted-foreground">k=5</div>
          </div>
        </div>

        {/* Reranker Node */}
        <div className="absolute top-20 right-24 w-32">
          <div className="p-3 rounded-lg border-2 border-pink-500/50 bg-pink-500/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="size-4 text-pink-500" />
              <span className="text-sm font-medium">Reranker</span>
            </div>
            <div className="text-xs text-muted-foreground">top_n=3</div>
          </div>
        </div>

        {/* LLM Node */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-36">
          <div className="p-3 rounded-lg border-2 border-purple-500/50 bg-purple-500/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="size-4 text-purple-500" />
              <span className="text-sm font-medium">LLM</span>
            </div>
            <div className="text-xs text-muted-foreground">gpt-4o</div>
          </div>
        </div>

        {/* Output Node */}
        <div className="absolute bottom-4 right-4 w-28">
          <div className="p-3 rounded-lg border-2 border-orange-500/50 bg-orange-500/10 shadow-lg">
            <div className="flex items-center gap-2">
              <Box className="size-4 text-orange-500" />
              <span className="text-sm font-medium">Output</span>
            </div>
          </div>
        </div>

        {/* Connection lines (simplified) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <path d="M 140 50 Q 160 50 175 40" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
          <path d="M 140 50 Q 160 70 175 85" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
}
