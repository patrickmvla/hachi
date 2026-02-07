"use client";

import { AlertTriangle, Terminal, XCircle } from "lucide-react";

const problems = [
  {
    code: "ERR_NO_EXECUTION",
    title: "Whiteboards don't execute",
    description: "You sketch architectures but can't test them. Ideas stay theoretical.",
    line: 12,
  },
  {
    code: "ERR_BLACK_BOX",
    title: "Failed experiments provide no insight",
    description: "Pipeline returns bad results. You don't know which step failed or why.",
    line: 47,
  },
  {
    code: "ERR_COMPLEXITY",
    title: "Advanced patterns are hard to visualize",
    description: "HyDE, CRAG, Fusion - reading papers doesn't show how they connect.",
    line: 89,
  },
];

export const Problem = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background pattern */}
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
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header - terminal style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/30 bg-red-500/5 text-red-500 text-xs font-medium mb-6">
            <AlertTriangle className="size-3.5" />
            <span>DIAGNOSTIC_REPORT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            You&apos;ve built naive RAG.
            <br />
            <span className="text-muted-foreground">Now what?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Retrieve documents. Pass to LLM. Get mediocre results. Sound familiar?
          </p>
        </div>

        {/* Terminal-style error log */}
        <div className="relative">
          {/* Terminal window */}
          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">rag_debugger.log</span>
              </div>
              <Terminal className="size-4 text-muted-foreground" />
            </div>

            {/* Terminal content */}
            <div className="p-6 space-y-1 font-mono text-sm">
              {/* Timestamp header */}
              <div className="text-muted-foreground text-xs mb-4">
                <span className="text-primary">[{new Date().toISOString().split("T")[0]}]</span> Running diagnostics on RAG pipeline...
              </div>

              {problems.map((problem, index) => (
                <div
                  key={problem.code}
                  className="group py-4 border-b border-border/30 last:border-0 hover:bg-muted/20 -mx-6 px-6 transition-colors"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${300 + index * 150}ms forwards`,
                    opacity: 0,
                  }}
                >
                  {/* Error line */}
                  <div className="flex items-start gap-3">
                    <XCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-red-500 font-semibold">{problem.code}</span>
                        <span className="text-muted-foreground">at line {problem.line}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-foreground font-medium">{problem.title}</span>
                      </div>
                      <div className="mt-1 text-muted-foreground text-xs leading-relaxed">
                        {problem.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary line */}
              <div
                className="pt-4 mt-4 border-t border-border/30 flex items-center justify-between text-xs"
                style={{
                  animation: "fadeInUp 0.5s ease-out 800ms forwards",
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-500">3 errors found</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">0 warnings</span>
                </div>
                <div className="text-muted-foreground">
                  Pipeline status: <span className="text-amber-500">degraded</span>
                </div>
              </div>

              {/* Blinking cursor */}
              <div className="pt-4 flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* Glow effect behind terminal */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-red-500/5 via-transparent to-transparent blur-3xl" />
        </div>

        {/* Solution hint */}
        <div
          className="mt-12 text-center"
          style={{
            animation: "fadeInUp 0.5s ease-out 1000ms forwards",
            opacity: 0,
          }}
        >
          <p className="text-sm text-muted-foreground">
            What if you could <span className="text-primary font-medium">see</span> exactly where your pipeline fails?
          </p>
        </div>
      </div>
    </section>
  );
};
