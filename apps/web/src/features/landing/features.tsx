"use client";

import { Workflow, Eye, Play, Users, Check } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Workflow,
    title: "Visual Canvas",
    description: "Design RAG architectures by connecting nodes. Drag HyDE, Retriever, Reranker, and Judge nodes. Wire them together. See the data flow.",
    points: [
      "Typed connections prevent invalid wiring",
      "Nodes represent real RAG patterns",
      "Export to executable code",
    ],
    color: "#2563eb",
    visual: CanvasVisual,
  },
  {
    icon: Eye,
    title: "Wire Tap Debugging",
    description: "Click any connection to see exact data flowing through. Stop guessing why retrieval failed — see embeddings, similarity scores, the Judge's reasoning.",
    points: [
      "Inspect every step's input and output",
      "See embedding vectors and scores",
      "Understand why the LLM hallucinated",
    ],
    color: "#7c3aed",
    visual: WireTapVisual,
  },
  {
    icon: Play,
    title: "Real Execution",
    description: "Not a simulation. Run actual LLM calls, real embeddings, against your documents. See real latency. Experience real failures — and understand them.",
    points: [
      "Actual API calls to your models",
      "Your own documents and data",
      "Live SSE streaming of progress",
    ],
    color: "#059669",
    visual: ExecutionVisual,
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Build architectures together. Senior engineers demonstrate patterns while the team watches. Debug together. Shared understanding.",
    points: [
      "Live cursors show who's where",
      "Changes sync instantly",
      "Shared execution results",
    ],
    color: "#d97706",
    visual: CollaborationVisual,
  },
];

export const Features = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section id="features" className="relative py-28 sm:py-36 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="max-w-[520px] mb-24">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-5">
            Capabilities
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] leading-[1.15] text-black mb-5">
            Engineering tools,<br />
            not a toy builder
          </h2>
          <p className="text-[16px] leading-relaxed text-black/40">
            A platform for understanding complex retrieval systems, from design through debugging.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const Visual = feature.visual;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center ${isReversed ? "" : ""}`}
              >
                {/* Text */}
                <div className={isReversed ? "lg:order-2" : ""}>
                  <div
                    className="inline-flex items-center justify-center size-10 rounded-lg border border-black/[0.06] mb-6"
                    style={{ color: feature.color }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-black/45 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2.5">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[13px] text-black/60">
                        <div
                          className="size-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${feature.color}12`, color: feature.color }}
                        >
                          <Check className="size-2.5" strokeWidth={3} />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={isReversed ? "lg:order-1" : ""}>
                  <Visual color={feature.color} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

function CanvasVisual({ color }: { color: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Grid background */}
      <div className="relative p-8 h-72 lg:h-80">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative h-full flex items-center justify-center">
          <div className="flex items-center gap-6 sm:gap-10">
            {[
              { letter: "Q", label: "Query", c: "#2563eb" },
              { letter: "R", label: "Retrieve", c: "#059669" },
              { letter: "G", label: "Generate", c: "#7c3aed" },
            ].map((node, i, arr) => (
              <div key={node.letter} className="flex items-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="size-14 sm:size-16 rounded-xl border-2 flex items-center justify-center bg-white"
                    style={{ borderColor: `${node.c}30` }}
                  >
                    <span className="text-sm font-bold" style={{ color: node.c }}>{node.letter}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-black/30">{node.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 sm:w-14 h-[2px] rounded-full" style={{ backgroundColor: `${arr[i + 1]?.c}25` }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-black/25 border-t border-black/[0.04] pt-3">
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            Ready to execute
          </div>
          <span>3 nodes connected</span>
        </div>
      </div>
    </div>
  );
}

function WireTapVisual({ color }: { color: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-black/[0.06]">
        <Eye className="size-3.5" style={{ color }} />
        <span className="text-[12px] font-medium text-black/70">Wire Inspector</span>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-black/30">
          <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
          Live
        </div>
      </div>

      <div className="p-5 h-60 lg:h-64 text-[12px] space-y-3.5 overflow-hidden">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-black/25 w-20 shrink-0">input</span>
            <span style={{ color }}>&quot;How does RAG work?&quot;</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-black/25 w-20 shrink-0">embedding</span>
            <span className="text-black/50 truncate">[0.123, -0.456, 0.789, 0.234, ...]</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-black/25 w-20 shrink-0">top_k</span>
            <span className="text-black/70">5</span>
          </div>
        </div>

        <div className="border-t border-black/[0.04] pt-3.5">
          <div className="text-black/25 mb-3">similarity_scores</div>
          <div className="space-y-2 pl-1">
            {[
              { score: 0.94, pct: 100 },
              { score: 0.87, pct: 90 },
              { score: 0.72, pct: 75 },
              { score: 0.65, pct: 68 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 h-1 rounded-full bg-black/[0.04]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.pct}%`, backgroundColor: color, opacity: 1 - i * 0.2 }}
                  />
                </div>
                <span className="text-black/40 w-8 text-right tabular-nums">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutionVisual({ color }: { color: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-black/[0.06]">
        <Play className="size-3.5" style={{ color }} />
        <span className="text-[12px] font-medium text-black/70">Execution</span>
        <div className="ml-auto flex items-center gap-1.5 text-[11px]" style={{ color }}>
          <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          Running
        </div>
      </div>

      <div className="p-5 h-60 lg:h-64 text-[12px] space-y-3">
        {[
          { status: "done", text: "Query node initialized", time: "0ms" },
          { status: "done", text: "Embedding generated (ada-002)", time: "89ms" },
          { status: "done", text: "Retrieved 5 documents", time: "156ms" },
          { status: "running", text: "LLM generating response...", time: "" },
          { status: "pending", text: "Output formatting", time: "" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {item.status === "done" && (
              <div className="size-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Check className="size-2.5" style={{ color }} strokeWidth={3} />
              </div>
            )}
            {item.status === "running" && (
              <div className="size-4 rounded-full border-[1.5px] border-t-transparent animate-spin" style={{ borderColor: `${color}50`, borderTopColor: "transparent" }} />
            )}
            {item.status === "pending" && (
              <div className="size-4 rounded-full border border-black/[0.08]" />
            )}
            <span className={item.status === "pending" ? "text-black/20" : item.status === "running" ? "text-black/70" : "text-black/55"}>
              {item.text}
            </span>
            {item.time && (
              <span className="ml-auto text-black/20 tabular-nums">{item.time}</span>
            )}
          </div>
        ))}

        <div className="border-t border-black/[0.04] pt-3 mt-3 flex items-center justify-between">
          <span className="text-black/25">Total elapsed</span>
          <span className="tabular-nums" style={{ color }}>245ms</span>
        </div>
      </div>
    </div>
  );
}

function CollaborationVisual({ color }: { color: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="relative p-6 h-72 lg:h-80">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Cursor - Alice */}
        <div
          className="absolute top-16 left-20 flex items-start gap-1"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="#2563eb">
            <path d="M0 0L10 7.5L5 8.5L6.5 14L4 13L2.5 8.5L0 10V0Z" />
          </svg>
          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">Alice</span>
        </div>

        {/* Cursor - Bob */}
        <div
          className="absolute top-36 right-24 flex items-start gap-1"
          style={{ animation: "float 3s ease-in-out infinite", animationDelay: "1s" }}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="#7c3aed">
            <path d="M0 0L10 7.5L5 8.5L6.5 14L4 13L2.5 8.5L0 10V0Z" />
          </svg>
          <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded font-medium">Bob</span>
        </div>

        {/* Selection box */}
        <div className="absolute top-24 left-32 w-28 h-16 border-2 border-dashed border-blue-500/30 rounded-lg bg-blue-500/[0.03]" />

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-black/[0.04] pt-3">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-1.5">
              <div className="size-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">A</div>
              <div className="size-6 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">B</div>
              <div className="size-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">C</div>
            </div>
            <span className="text-[11px] text-black/25">3 online</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            Synced
          </div>
        </div>
      </div>
    </div>
  );
}
