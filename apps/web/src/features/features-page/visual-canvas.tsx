import {
  Workflow,
  Layers,
  GitBranch,
  Code2,
  MessageSquare,
  Database,
  Cpu,
  Lightbulb,
  RefreshCw,
  Box,
} from "lucide-react";
import { FeaturePoint } from "./shared";

export const VisualCanvasSection = () => {
  return (
    <section id="canvas" className="py-20 px-6 bg-white scroll-mt-16">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          {/* Text */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center justify-center size-10 rounded-lg border border-black/[0.06] text-blue-600 mb-5">
              <Workflow className="size-5" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
              Visual Canvas
            </h2>
            <p className="text-[15px] text-black/40 mb-8 leading-relaxed">
              Design complex RAG architectures visually. Drag nodes, connect them with typed wires,
              and see your pipeline take shape.
            </p>

            <div className="space-y-5">
              <FeaturePoint
                title="Drag-and-drop nodes"
                description="Query, Retriever, Reranker, LLM, and more. Each node encapsulates a real RAG pattern."
              />
              <FeaturePoint
                title="Typed connections"
                description="Can't wire a text output to an embedding input. Catch errors before execution."
              />
              <FeaturePoint
                title="Zoom and pan"
                description="Navigate complex architectures with smooth zoom and pan. Fit large pipelines on any screen."
              />
              <FeaturePoint
                title="Export to code"
                description="Export your visual architecture to production-ready Python or TypeScript."
              />
            </div>
          </div>

          {/* Demo */}
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="relative p-6 h-[420px]">
              {/* Grid bg */}
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Nodes */}
              <div className="relative h-full">
                <CanvasNode icon={<MessageSquare className="size-3.5" />} label="Query" detail={`"How does..."`} color="#2563eb" style={{ top: 24, left: 16 }} />
                <CanvasNode icon={<Lightbulb className="size-3.5" />} label="HyDE" detail="Expand query" color="#d97706" style={{ top: 8, left: 180 }} />
                <CanvasNode icon={<Database className="size-3.5" />} label="Retriever" detail="k=5" color="#059669" style={{ top: 100, left: 180 }} />
                <CanvasNode icon={<RefreshCw className="size-3.5" />} label="Reranker" detail="top_n=3" color="#ec4899" style={{ top: 60, right: 40 }} />
                <CanvasNode icon={<Cpu className="size-3.5" />} label="LLM" detail="gpt-4o" color="#7c3aed" style={{ bottom: 80, left: "50%", transform: "translateX(-50%)" }} />
                <CanvasNode icon={<Box className="size-3.5" />} label="Output" detail="" color="#f97316" style={{ bottom: 16, right: 16 }} />
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.06] bg-black/[0.01]">
              <span className="text-[11px] text-black/25">6 nodes &middot; 5 connections</span>
              <div className="flex items-center gap-1.5 text-[11px] text-black/25">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                Ready to execute
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function CanvasNode({
  icon,
  label,
  detail,
  color,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  color: string;
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute w-[130px]" style={style}>
      <div
        className="p-2.5 rounded-xl border-2 bg-white shadow-sm"
        style={{ borderColor: `${color}30` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color }}>{icon}</span>
          <span className="text-[12px] font-semibold text-black">{label}</span>
        </div>
        {detail && <div className="text-[10px] text-black/30 truncate">{detail}</div>}
      </div>
      {/* Connector dot */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-2.5 rounded-full border-2 border-white"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
