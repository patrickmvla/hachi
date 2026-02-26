import {
  Search,
  FileText,
  GitBranch,
  Database,
  ArrowRightLeft,
  Scale,
  Cpu,
  Bot,
  Eye,
  LayoutGrid,
  Code,
  History,
  BookTemplate,
} from "lucide-react";
import { FeaturePoint, DetailCard } from "./shared";

const PALETTE_ITEMS = [
  { label: "Query", icon: Search, color: "#2563eb" },
  { label: "Embedding", icon: GitBranch, color: "#ec4899" },
  { label: "Retriever", icon: Database, color: "#f97316" },
  { label: "Reranker", icon: ArrowRightLeft, color: "#eab308" },
  { label: "Judge", icon: Scale, color: "#ef4444" },
  { label: "LLM", icon: Cpu, color: "#a855f7" },
];

const PIPELINE_NODES = [
  { label: "Query", icon: Search, color: "#2563eb", status: "done" as const, x: 0 },
  { label: "HyDE", icon: FileText, color: "#3b82f6", status: "done" as const, x: 1 },
  { label: "Embedding", icon: GitBranch, color: "#ec4899", status: "done" as const, x: 2 },
  { label: "Retriever", icon: Database, color: "#f97316", status: "running" as const, x: 3, wiretap: true },
  { label: "Reranker", icon: ArrowRightLeft, color: "#eab308", status: "pending" as const, x: 4 },
  { label: "LLM", icon: Cpu, color: "#a855f7", status: "pending" as const, x: 5 },
];

const CONNECTION_BADGES = [
  { label: "STRING", color: "#2563eb" },
  { label: "VECTOR", color: "#a855f7" },
  { label: "DOCUMENT", color: "#22c55e" },
  { label: "DOCUMENT", color: "#22c55e" },
  { label: "JSON", color: "#f97316" },
];

export const VisualCanvasSection = () => {
  return (
    <section id="canvas" className="py-24 sm:py-32 px-6 bg-white scroll-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
              Visual Canvas
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-[1.15] text-black mb-4">
              Design your pipeline,
              <br />
              node by node
            </h2>
            <p className="text-[15px] leading-relaxed text-black/40 mb-8">
              Drag nodes from the palette, connect them with typed wires, and configure everything inline. Your entire RAG architecture in one visual workspace.
            </p>
            <div className="space-y-4">
              <FeaturePoint
                title="8 specialized node types"
                description="Query, HyDE, Embedding, Retriever, Reranker, Judge, LLM, and Agent — each purpose-built."
              />
              <FeaturePoint
                title="Typed connections"
                description="STRING, VECTOR, DOCUMENT, JSON — the canvas validates wire compatibility as you build."
              />
              <FeaturePoint
                title="Inline property panels"
                description="Click any node to configure model, temperature, top-k, and prompt right on the canvas."
              />
              <FeaturePoint
                title="Keyboard shortcuts"
                description="Cmd+C/V to copy nodes, Delete to remove, Cmd+Z to undo. Feels like a native app."
              />
            </div>
          </div>

          {/* Mockup column */}
          <div>
            <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                  <div className="size-[9px] rounded-full bg-black/10" />
                </div>
                <span className="text-[11px] text-black/30 tracking-wide">
                  crag-pipeline.hachi
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-black/30">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  saved
                </div>
              </div>

              {/* Three-panel content */}
              <div className="flex min-h-[320px]">
                {/* Left: Node palette */}
                <div className="w-[130px] border-r border-black/[0.06] p-3 shrink-0 hidden sm:block">
                  <span className="text-[9px] uppercase tracking-wider text-black/25 font-medium block mb-3">
                    Nodes
                  </span>
                  <div className="space-y-1.5">
                    {PALETTE_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-black/[0.06] bg-white hover:border-black/[0.12] cursor-grab transition-colors"
                        >
                          <Icon className="size-3" style={{ color: item.color }} />
                          <span className="text-[10px] text-black/50 font-medium">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Center: Pipeline canvas */}
                <div className="flex-1 relative p-4 sm:p-6">
                  {/* Grid background */}
                  <div
                    className="absolute inset-0 opacity-[0.3] pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative">
                    {/* Pipeline as 2 rows of 3 */}
                    <div className="space-y-6">
                      {/* Row 1: Query → HyDE → Embedding */}
                      <div className="flex items-center gap-2">
                        {PIPELINE_NODES.slice(0, 3).map((node, i) => {
                          const Icon = node.icon;
                          return (
                            <div key={node.label} className="flex items-center gap-2 flex-1">
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className="size-10 sm:size-11 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                                  style={{ borderColor: `${node.color}30` }}
                                >
                                  <Icon className="size-3.5" style={{ color: node.color }} />
                                </div>
                                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-black/35 font-medium">
                                  {node.label}
                                </span>
                                {node.status === "done" && (
                                  <div className="size-1.5 rounded-full bg-emerald-500" />
                                )}
                              </div>
                              {i < 2 && (
                                <div className="flex-1 flex flex-col items-center gap-0.5 min-w-[20px]">
                                  <span
                                    className="text-[7px] font-mono font-medium px-1 py-px rounded"
                                    style={{
                                      backgroundColor: `${CONNECTION_BADGES[i]!.color}10`,
                                      color: CONNECTION_BADGES[i]!.color,
                                    }}
                                  >
                                    {CONNECTION_BADGES[i]!.label}
                                  </span>
                                  <div className="w-full h-[1.5px] bg-black/[0.08]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Row 2: Retriever → Reranker → LLM */}
                      <div className="flex items-center gap-2">
                        {PIPELINE_NODES.slice(3).map((node, i) => {
                          const Icon = node.icon;
                          return (
                            <div key={node.label} className="flex items-center gap-2 flex-1">
                              <div className="flex flex-col items-center gap-1 relative">
                                <div
                                  className={`size-10 sm:size-11 rounded-lg border bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                                    node.status === "running" ? "ring-2 ring-blue-500/20" : ""
                                  }`}
                                  style={{ borderColor: `${node.color}30` }}
                                >
                                  <Icon className="size-3.5" style={{ color: node.color }} />
                                </div>
                                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-black/35 font-medium">
                                  {node.label}
                                </span>
                                {node.status === "done" && (
                                  <div className="size-1.5 rounded-full bg-emerald-500" />
                                )}
                                {node.status === "running" && (
                                  <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                                )}
                                {node.status === "pending" && (
                                  <div className="size-1.5 rounded-full bg-black/10" />
                                )}
                                {/* Wire tap button */}
                                {node.wiretap && (
                                  <div className="absolute -top-2 -right-2 size-4 rounded-full bg-black flex items-center justify-center">
                                    <Eye className="size-2 text-white" />
                                  </div>
                                )}
                              </div>
                              {i < 2 && (
                                <div className="flex-1 flex flex-col items-center gap-0.5 min-w-[20px]">
                                  <span
                                    className="text-[7px] font-mono font-medium px-1 py-px rounded"
                                    style={{
                                      backgroundColor: `${CONNECTION_BADGES[i + 3]!.color}10`,
                                      color: CONNECTION_BADGES[i + 3]!.color,
                                    }}
                                  >
                                    {CONNECTION_BADGES[i + 3]!.label}
                                  </span>
                                  <div className="w-full h-[1.5px] bg-black/[0.08]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Property panel */}
                <div className="w-[150px] border-l border-black/[0.06] p-3 shrink-0 hidden md:block">
                  <span className="text-[9px] uppercase tracking-wider text-black/25 font-medium block mb-3">
                    LLM Properties
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-black/30 block mb-1">Model</label>
                      <div className="flex items-center justify-between px-2 py-1.5 rounded-md border border-black/[0.06] bg-black/[0.01]">
                        <span className="text-[10px] text-black/60">gpt-4-turbo</span>
                        <svg className="size-2.5 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-black/30 block mb-1">Temperature</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-black/[0.06] relative">
                          <div className="absolute left-0 top-0 h-full w-[70%] rounded-full bg-purple-500/40" />
                          <div className="absolute top-1/2 -translate-y-1/2 left-[70%] size-2.5 rounded-full bg-purple-500 border-2 border-white shadow-sm" />
                        </div>
                        <span className="text-[9px] text-black/40 font-mono">0.7</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-black/30 block mb-1">Max Tokens</label>
                      <div className="px-2 py-1.5 rounded-md border border-black/[0.06] bg-black/[0.01]">
                        <span className="text-[10px] text-black/60 font-mono">4096</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-black/30 block mb-1">System Prompt</label>
                      <div className="px-2 py-1.5 rounded-md border border-black/[0.06] bg-black/[0.01] min-h-[40px]">
                        <span className="text-[9px] text-black/35 leading-relaxed">
                          You are a helpful assistant that answers questions using the provided context...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] bg-black/[0.01]">
                <span className="text-[10px] text-black/30">
                  6 nodes &middot; 5 connections
                </span>
                <div className="flex items-center gap-3 text-[10px] text-black/30">
                  <span>CRAG pattern</span>
                  <div className="flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <span>valid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail cards + mono */}
        <div className="mt-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <DetailCard
              icon={LayoutGrid}
              title="Smart auto-layout"
              description="Nodes automatically arrange into clean topological layouts. Manual adjustments snap to grid."
            />
            <DetailCard
              icon={Code}
              title="Export to code"
              description="One-click export to a standalone TypeScript pipeline you can run anywhere."
            />
            <DetailCard
              icon={History}
              title="Version history"
              description="Every save creates a version. Diff, compare, and restore any previous pipeline state."
            />
            <DetailCard
              icon={BookTemplate}
              title="Template library"
              description="Start from pre-built patterns: HyDE, CRAG, Fusion, Parent-Child, and more."
            />
          </div>
          <p className="mt-6 text-[12px] font-mono text-black/20">
            query → embedding → retriever → judge → reranker → llm → output
          </p>
        </div>
      </div>
    </section>
  );
};
