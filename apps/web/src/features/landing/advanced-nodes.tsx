"use client";

import { Lightbulb, GitFork, Merge, Scale, Blocks } from "lucide-react";

const nodes = [
  {
    icon: Lightbulb,
    name: "HyDE",
    fullName: "Hypothetical Document Embeddings",
    description: "Generate hypothetical answers to improve short query embeddings",
    color: "cyan",
  },
  {
    icon: GitFork,
    name: "Parent-Child",
    fullName: "Hierarchical Chunking",
    description: "Match on small chunks, return large chunks for context",
    color: "violet",
  },
  {
    icon: Merge,
    name: "Fusion",
    fullName: "Reciprocal Rank Fusion",
    description: "Combine BM25 + vector search with intelligent ranking",
    color: "emerald",
  },
  {
    icon: Scale,
    name: "Judge",
    fullName: "CRAG Pattern",
    description: "Evaluate relevance and route to fallback if needed",
    color: "amber",
  },
];

const colorStyles: Record<string, { border: string; bg: string; text: string; glow: string; shadow: string }> = {
  cyan: {
    border: "border-cyan-500/30 group-hover:border-cyan-500/60",
    bg: "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5",
    text: "text-cyan-400",
    glow: "bg-cyan-500/20",
    shadow: "shadow-cyan-500/20",
  },
  violet: {
    border: "border-violet-500/30 group-hover:border-violet-500/60",
    bg: "bg-gradient-to-br from-violet-500/20 to-violet-500/5",
    text: "text-violet-400",
    glow: "bg-violet-500/20",
    shadow: "shadow-violet-500/20",
  },
  emerald: {
    border: "border-emerald-500/30 group-hover:border-emerald-500/60",
    bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5",
    text: "text-emerald-400",
    glow: "bg-emerald-500/20",
    shadow: "shadow-emerald-500/20",
  },
  amber: {
    border: "border-amber-500/30 group-hover:border-amber-500/60",
    bg: "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
    text: "text-amber-400",
    glow: "bg-amber-500/20",
    shadow: "shadow-amber-500/20",
  },
};

export const AdvancedNodes = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            <Blocks className="size-3.5" />
            <span>BUILDING_BLOCKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Advanced RAG patterns
            <br />
            <span className="text-primary">as drag-and-drop nodes</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each node encapsulates a complex pattern. Connect them. Run them. Inspect them.
          </p>
        </div>

        {/* Nodes grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {nodes.map((node, index) => {
            const styles = colorStyles[node.color]!;
            const Icon = node.icon;

            return (
              <div
                key={node.name}
                className={`group relative p-6 rounded-xl border ${styles.border} bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${styles.shadow} cursor-pointer`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${200 + index * 100}ms forwards`,
                  opacity: 0,
                }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 ${styles.glow} blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />

                {/* Icon */}
                <div className={`relative size-12 rounded-lg ${styles.bg} ${styles.text} flex items-center justify-center mb-5 border ${styles.border}`}>
                  <Icon className="size-5" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-lg">{node.name}</h4>
                  </div>
                  <p className={`text-xs ${styles.text} font-medium uppercase tracking-wide`}>
                    {node.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {node.description}
                  </p>
                </div>

                {/* Connection indicator */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`size-4 rounded-full ${styles.bg} border ${styles.border} flex items-center justify-center`}>
                    <div className={`size-2 rounded-full ${styles.text.replace("text-", "bg-")}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div
          className="mt-16 text-center"
          style={{
            animation: "fadeInUp 0.5s ease-out 800ms forwards",
            opacity: 0,
          }}
        >
          <p className="text-sm text-muted-foreground">
            Combine these patterns to build sophisticated retrieval pipelines
          </p>
        </div>
      </div>
    </section>
  );
};
