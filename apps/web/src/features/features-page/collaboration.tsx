import { Users, MousePointer2, Share2, Eye, Terminal, Database } from "lucide-react";
import { FeaturePoint } from "./shared";

export function CollaborationSection() {
  return (
    <section id="collaboration" className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <CollaborationDemo />
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-purple-500/10 text-purple-500 mb-6">
              <Users className="size-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real-time Collaboration</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Build architectures together. Senior engineers can demonstrate patterns while
              juniors watch and learn. Debug together with shared context.
            </p>

            <div className="space-y-6">
              <FeaturePoint
                icon={<MousePointer2 className="size-4" />}
                title="Live cursors"
                description="See where your teammates are working in real time. Colored cursors show who's doing what."
              />
              <FeaturePoint
                icon={<Share2 className="size-4" />}
                title="Instant sync"
                description="Changes sync instantly across all connected clients. No refresh needed, no merge conflicts."
              />
              <FeaturePoint
                icon={<Eye className="size-4" />}
                title="Shared Wire Tap"
                description="When someone opens a Wire Tap, everyone sees the same data. Debug together with shared context."
              />
              <FeaturePoint
                icon={<Terminal className="size-4" />}
                title="Shared execution"
                description="Run a pipeline and everyone sees the results. Great for demos and teaching sessions."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollaborationDemo() {
  return (
    <div className="relative h-96 rounded-2xl border bg-muted/30 overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

      {/* Cursor Alice */}
      <div className="absolute top-20 left-24 flex items-start gap-1 animate-pulse">
        <svg width="16" height="24" viewBox="0 0 12 18" className="text-blue-500">
          <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
        </svg>
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Alice</span>
      </div>

      {/* Cursor Bob */}
      <div className="absolute top-40 right-32 flex items-start gap-1">
        <svg width="16" height="24" viewBox="0 0 12 18" className="text-purple-500">
          <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
        </svg>
        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Bob</span>
      </div>

      {/* Selection by Alice */}
      <div className="absolute top-28 left-20 w-40 h-20 border-2 border-dashed border-blue-500/50 rounded-lg bg-blue-500/5" />

      {/* A node being dragged */}
      <div className="absolute top-32 left-24 w-28 opacity-90 animate-pulse">
        <div className="p-2 rounded-lg border-2 border-green-500/50 bg-green-500/10 shadow-lg">
          <div className="flex items-center gap-2">
            <Database className="size-3 text-green-500" />
            <span className="text-xs font-medium">Retriever</span>
          </div>
        </div>
      </div>

      {/* Chat/Activity Panel */}
      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl border bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Activity</span>
          <div className="flex -space-x-2">
            <div className="size-6 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">A</div>
            <div className="size-6 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">B</div>
            <div className="size-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">C</div>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <p><span className="text-blue-500">Alice</span> <span className="text-muted-foreground">moved Retriever node</span></p>
          <p><span className="text-purple-500">Bob</span> <span className="text-muted-foreground">opened Wire Tap</span></p>
        </div>
      </div>

      {/* Sync indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Synced
      </div>
    </div>
  );
}
