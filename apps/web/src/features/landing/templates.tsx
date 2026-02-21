"use client";

import Link from "next/link";
import { Layers, Lightbulb, Search, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const templates = [
  {
    name: "Naive RAG",
    description: "The foundation. Query, embed, retrieve, generate.",
    icon: Layers,
    nodes: 4,
    color: "#2563eb",
  },
  {
    name: "HyDE Pipeline",
    description: "Expand short queries with hypothetical documents.",
    icon: Lightbulb,
    nodes: 6,
    color: "#7c3aed",
  },
  {
    name: "Hybrid Search",
    description: "BM25 + vector search with reranking fusion.",
    icon: Search,
    nodes: 7,
    color: "#059669",
  },
];

export const Templates = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative py-28 sm:py-36 px-6 bg-white">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-[480px]">
            <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-5">
              Templates
            </span>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] leading-[1.15] text-black mb-4">
              Start with reference<br />
              architectures
            </h2>
            <p className="text-[16px] leading-relaxed text-black/40">
              Load production-grade patterns. Run them. Inspect them. Modify them.
            </p>
          </div>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-full border border-black/[0.08] text-black/60 hover:border-black/20 hover:text-black transition-all shrink-0"
          >
            View all templates
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Templates grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {templates.map((template, index) => {
            const Icon = template.icon;

            return (
              <Link
                key={template.name}
                href="/templates"
                className="group p-6 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
                style={mounted ? { animation: `fadeInUp 0.5s ease-out ${200 + index * 80}ms forwards`, opacity: 0 } : { opacity: 0 }}
              >
                {/* Icon */}
                <div
                  className="size-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${template.color}08`, color: template.color }}
                >
                  <Icon className="size-[18px]" />
                </div>

                <h4 className="font-bold text-[15px] text-black mb-2 group-hover:text-black transition-colors">
                  {template.name}
                </h4>
                <p className="text-[13px] text-black/40 leading-relaxed mb-5">
                  {template.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-[11px] pt-4 border-t border-black/[0.04]">
                  <span className="text-black/25">{template.nodes} nodes</span>
                  <span className="font-medium transition-colors" style={{ color: template.color }}>
                    Use template
                    <span className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More templates */}
        <div
          className="mt-12 text-center"
          style={mounted ? { animation: "fadeInUp 0.5s ease-out 500ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-[13px] text-black/30 hover:text-black/60 transition-colors group"
          >
            + 3 more: CRAG, Parent-Child, Agentic RAG
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
