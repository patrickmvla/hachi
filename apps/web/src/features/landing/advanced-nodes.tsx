"use client";

import { Lightbulb, GitFork, Merge, Scale } from "lucide-react";
import { useEffect, useState } from "react";

const nodes = [
  {
    icon: Lightbulb,
    name: "HyDE",
    fullName: "Hypothetical Document Embeddings",
    description: "Generate hypothetical answers to improve short query embeddings",
    color: "#2563eb",
  },
  {
    icon: GitFork,
    name: "Parent-Child",
    fullName: "Hierarchical Chunking",
    description: "Match on small chunks, return large chunks for context",
    color: "#7c3aed",
  },
  {
    icon: Merge,
    name: "Fusion",
    fullName: "Reciprocal Rank Fusion",
    description: "Combine BM25 + vector search with intelligent ranking",
    color: "#059669",
  },
  {
    icon: Scale,
    name: "Judge",
    fullName: "CRAG Pattern",
    description: "Evaluate relevance and route to fallback if needed",
    color: "#d97706",
  },
];

export const AdvancedNodes = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative py-28 sm:py-36 px-6 bg-[#fafafa]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-5">
            Building blocks
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] leading-[1.15] text-black mb-5">
            Advanced RAG patterns<br />
            as drag-and-drop nodes
          </h2>
          <p className="text-[16px] leading-relaxed text-black/40 max-w-[480px] mx-auto">
            Each node encapsulates a complex pattern. Connect them. Run them. Inspect them.
          </p>
        </div>

        {/* Nodes grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map((node, index) => {
            const Icon = node.icon;

            return (
              <div
                key={node.name}
                className="group relative p-6 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.12] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] cursor-pointer"
                style={mounted ? { animation: `fadeInUp 0.5s ease-out ${200 + index * 80}ms forwards`, opacity: 0 } : { opacity: 0 }}
              >
                {/* Icon */}
                <div
                  className="size-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${node.color}08`, color: node.color }}
                >
                  <Icon className="size-[18px]" />
                </div>

                {/* Content */}
                <h4 className="font-bold text-[15px] text-black mb-1">{node.name}</h4>
                <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: node.color }}>
                  {node.fullName}
                </p>
                <p className="text-[13px] leading-relaxed text-black/40">
                  {node.description}
                </p>

                {/* Hover connector dot */}
                <div
                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: node.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <p
          className="mt-14 text-center text-[13px] text-black/30"
          style={mounted ? { animation: "fadeInUp 0.5s ease-out 600ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          Combine these patterns to build sophisticated retrieval pipelines
        </p>
      </div>
    </section>
  );
};
