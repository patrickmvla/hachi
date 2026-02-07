"use client";

import Link from "next/link";
import { Layers, Lightbulb, Search, ArrowRight, LayoutTemplate, Workflow } from "lucide-react";

const featuredTemplates = [
  {
    name: "Naive RAG",
    description: "The foundation. Query → Embed → Retrieve → Generate",
    icon: Layers,
    nodes: 4,
    color: "cyan",
  },
  {
    name: "HyDE Pipeline",
    description: "Expand short queries with hypothetical documents",
    icon: Lightbulb,
    nodes: 6,
    color: "violet",
  },
  {
    name: "Hybrid Search",
    description: "BM25 + Vector search with reranking",
    icon: Search,
    nodes: 7,
    color: "emerald",
  },
];

export const Templates = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
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

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
              <LayoutTemplate className="size-3.5" />
              <span>TEMPLATES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Start with reference
              <br />
              <span className="text-primary">architectures</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Load production-grade patterns. Run them. Inspect them. Modify them.
            </p>
          </div>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all shrink-0"
          >
            <Workflow className="size-4" />
            View all templates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Templates grid */}
        <div className="grid sm:grid-cols-3 gap-5">
          {featuredTemplates.map((template, index) => {
            const Icon = template.icon;
            const colorClasses = {
              cyan: {
                border: "border-cyan-500/30 group-hover:border-cyan-500/60",
                bg: "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5",
                text: "text-cyan-400",
                glow: "bg-cyan-500/10",
              },
              violet: {
                border: "border-violet-500/30 group-hover:border-violet-500/60",
                bg: "bg-gradient-to-br from-violet-500/20 to-violet-500/5",
                text: "text-violet-400",
                glow: "bg-violet-500/10",
              },
              emerald: {
                border: "border-emerald-500/30 group-hover:border-emerald-500/60",
                bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5",
                text: "text-emerald-400",
                glow: "bg-emerald-500/10",
              },
            }[template.color]!;

            return (
              <Link
                key={template.name}
                href="/templates"
                className={`group relative p-6 rounded-xl border ${colorClasses.border} bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${200 + index * 100}ms forwards`,
                  opacity: 0,
                }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 ${colorClasses.glow} blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />

                {/* Icon */}
                <div className={`size-12 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center mb-5 border ${colorClasses.border}`}>
                  <Icon className="size-5" />
                </div>

                {/* Content */}
                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {template.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {template.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
                  <span>{template.nodes} nodes</span>
                  <span className={`${colorClasses.text}`}>Use template →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More templates hint */}
        <div
          className="mt-12 text-center"
          style={{
            animation: "fadeInUp 0.5s ease-out 600ms forwards",
            opacity: 0,
          }}
        >
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span>+ 3 more templates: CRAG, Parent-Child, Agentic RAG</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
