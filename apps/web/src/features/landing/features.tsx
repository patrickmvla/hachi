"use client";

import { Workflow, Eye, Play, Users, Check, Database, Cpu, MessageSquare, Sparkles } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            <Sparkles className="size-3.5" />
            <span>CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Engineering tools for
            <br />
            <span className="text-primary">RAG architecture</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Not a low-code builder. A platform for understanding complex systems.
          </p>
        </div>

        <div className="space-y-32">
          {/* Feature 1: Visual Canvas */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center size-12 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 mb-6">
                <Workflow className="size-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Visual Canvas</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Design advanced RAG architectures by connecting nodes. Drag HyDE, Retriever,
                Reranker, and Judge nodes. Wire them together. See the data flow.
              </p>
              <ul className="space-y-3">
                {["Typed connections prevent invalid wiring", "Nodes represent real RAG patterns", "Export to code when ready"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-cyan-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <CanvasVisual />
            </div>
          </div>

          {/* Feature 2: Wire Tap */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2">
              <div className="inline-flex items-center justify-center size-12 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-500 mb-6">
                <Eye className="size-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Wire Tap Debugging</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Click any connection to see the exact data flowing through. Stop guessing why
                retrieval failed - see the embeddings, the similarity scores, the Judge&apos;s reasoning.
              </p>
              <ul className="space-y-3">
                {["Inspect every step's input and output", "See embedding vectors and scores", "Understand why the LLM hallucinated"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-violet-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1">
              <WireTapVisual />
            </div>
          </div>

          {/* Feature 3: Real Execution */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center size-12 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 mb-6">
                <Play className="size-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Real Execution</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not a simulation. Run actual LLM calls, real embeddings, against your documents.
                See real latency. Experience real failures - and understand them.
              </p>
              <ul className="space-y-3">
                {["Actual API calls to your models", "Your own documents and data", "SSE streaming shows progress live"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-emerald-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <ExecutionVisual />
            </div>
          </div>

          {/* Feature 4: Collaboration */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2">
              <div className="inline-flex items-center justify-center size-12 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 mb-6">
                <Users className="size-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Real-time Collaboration</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Build architectures together. Senior engineers can demonstrate patterns while
                the team watches. Debug together. Shared Wire Tap means shared understanding.
              </p>
              <ul className="space-y-3">
                {["Live cursors show who's working where", "Changes sync instantly", "Shared execution results"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-amber-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1">
              <CollaborationVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CanvasVisual = () => {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />

      <div className="relative p-8 h-72 lg:h-80">
        <div className="h-full flex items-center justify-center">
          {/* Node flow visualization */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Query Node */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative size-12 sm:size-14 rounded-lg border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <MessageSquare className="size-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Query</span>
            </div>

            {/* Connection */}
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 animate-pulse" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-emerald-500 rounded-full" />
            </div>

            {/* Retriever Node */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative size-12 sm:size-14 rounded-lg border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <Database className="size-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Retrieve</span>
            </div>

            {/* Connection */}
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-violet-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-violet-500 animate-pulse" style={{ animationDelay: "200ms" }} />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-violet-500 rounded-full" />
            </div>

            {/* LLM Node */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/30 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative size-12 sm:size-14 rounded-lg border-2 border-violet-500/50 bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shadow-lg shadow-violet-500/10">
                  <Cpu className="size-5 text-violet-400" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Generate</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Ready to execute</span>
          </div>
          <span>3 nodes connected</span>
        </div>
      </div>
    </div>
  );
};

const WireTapVisual = () => {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full" />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <Eye className="size-4 text-violet-500" />
        <span className="text-sm font-medium">Wire Inspector</span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-violet-500 animate-pulse" />
          Live
        </div>
      </div>

      <div className="p-5 h-56 lg:h-64 font-mono text-xs space-y-3 overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-20 shrink-0">input</span>
            <span className="text-cyan-400">&quot;How does RAG work?&quot;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-20 shrink-0">embedding</span>
            <span className="text-violet-400 truncate">[0.123, -0.456, 0.789, 0.234, ...]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-20 shrink-0">top_k</span>
            <span className="text-amber-400">5</span>
          </div>
        </div>

        <div className="border-t border-border/30 pt-3">
          <div className="text-muted-foreground mb-2">similarity_scores</div>
          <div className="space-y-1.5 pl-2">
            {[
              { score: 0.94, width: "w-full" },
              { score: 0.87, width: "w-[90%]" },
              { score: 0.72, width: "w-[75%]" },
              { score: 0.65, width: "w-[68%]" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-1.5 ${item.width} rounded-full bg-gradient-to-r from-violet-500 to-cyan-500`} style={{ opacity: 1 - i * 0.2 }} />
                <span className="text-violet-400 w-10">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExecutionVisual = () => {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Glow effect */}
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <Play className="size-4 text-emerald-500" />
        <span className="text-sm font-medium">Execution Log</span>
        <div className="ml-auto flex items-center gap-1.5 text-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500">Running</span>
        </div>
      </div>

      <div className="p-5 h-56 lg:h-64 font-mono text-xs space-y-3">
        {[
          { status: "done", text: "Query node initialized", time: "0ms" },
          { status: "done", text: "Embedding generated", time: "89ms" },
          { status: "done", text: "Retrieved 5 documents", time: "156ms" },
          { status: "running", text: "LLM generating response...", time: "" },
          { status: "pending", text: "Output formatting", time: "" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.status === "done" && (
              <div className="size-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="size-2.5 text-emerald-500" />
              </div>
            )}
            {item.status === "running" && (
              <div className="size-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            )}
            {item.status === "pending" && (
              <div className="size-4 rounded-full border border-border/50" />
            )}
            <span className={item.status === "pending" ? "text-muted-foreground" : item.status === "running" ? "text-cyan-400" : "text-foreground"}>
              {item.text}
            </span>
            {item.time && (
              <span className="ml-auto text-muted-foreground">{item.time}</span>
            )}
          </div>
        ))}

        {/* Total time */}
        <div className="border-t border-border/30 pt-3 mt-3 flex items-center justify-between">
          <span className="text-muted-foreground">Total elapsed</span>
          <span className="text-emerald-400">245ms</span>
        </div>
      </div>
    </div>
  );
};

const CollaborationVisual = () => {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative p-6 h-72 lg:h-80">
        {/* Cursor 1 - Alice */}
        <div
          className="absolute top-16 left-20 flex items-start gap-1"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <svg width="12" height="18" viewBox="0 0 12 18" className="text-cyan-500 drop-shadow-lg">
            <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
          </svg>
          <span className="text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded shadow-lg shadow-cyan-500/30">Alice</span>
        </div>

        {/* Cursor 2 - Bob */}
        <div
          className="absolute top-32 right-20 flex items-start gap-1"
          style={{ animation: "float 3s ease-in-out infinite", animationDelay: "1s" }}
        >
          <svg width="12" height="18" viewBox="0 0 12 18" className="text-violet-500 drop-shadow-lg">
            <path d="M0 0L12 9L6 10L8 18L5 17L3 10L0 12V0Z" fill="currentColor" />
          </svg>
          <span className="text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded shadow-lg shadow-violet-500/30">Bob</span>
        </div>

        {/* Selection highlight */}
        <div className="absolute top-24 left-32 w-28 h-14 border-2 border-dashed border-cyan-500/50 rounded-lg bg-cyan-500/5 animate-pulse" />

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="size-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold shadow-lg">A</div>
              <div className="size-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold shadow-lg">B</div>
              <div className="size-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold shadow-lg">C</div>
            </div>
            <span className="text-xs text-muted-foreground">3 online</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Synced
          </div>
        </div>
      </div>
    </div>
  );
};
