"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Search,
  GitBranch,
  Database,
  ArrowRightLeft,
  Cpu,
} from "lucide-react";
import { useEffect, useState } from "react";

const PIPELINE_NODES = [
  { label: "Query", icon: Search, detail: '"How does RAG work?"' },
  { label: "Embedding", icon: GitBranch, detail: "text-embedding-3-small" },
  { label: "Retriever", icon: Database, detail: "top_k: 5" },
  { label: "Reranker", icon: ArrowRightLeft, detail: "cross-encoder" },
  { label: "LLM", icon: Cpu, detail: "gpt-4-turbo" },
] as const;

export const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-6 bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
        {/* Text side */}
        <div
          style={
            mounted
              ? { animation: "fadeInUp 0.7s ease-out forwards" }
              : { opacity: 0 }
          }
        >
          <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold tracking-[-0.035em] leading-[1.1] text-black mb-6">
            Build RAG pipelines
            <br />
            you can debug.
          </h1>
          <p className="text-[16px] sm:text-[17px] leading-relaxed text-black/45 max-w-[440px] mb-10">
            Wire together retrieval nodes. Execute against real LLM APIs.
            Inspect data at every connection.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold rounded-full bg-black text-white hover:bg-black/85 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]"
            >
              Get started
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/mini-map"
              className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-medium rounded-full border border-black/10 text-black/70 hover:border-black/20 hover:text-black hover:bg-black/[0.02] transition-all"
            >
              Try playground
              <ArrowRight className="size-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Canvas mockup */}
        <div
          style={
            mounted
              ? {
                  animation: "fadeInUp 0.8s ease-out 200ms forwards",
                  opacity: 0,
                }
              : { opacity: 0 }
          }
        >
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
                ready
              </div>
            </div>

            {/* Pipeline */}
            <div className="px-5 py-8 sm:py-10">
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

              <div className="relative flex items-center justify-between gap-1">
                {PIPELINE_NODES.map((node, i) => {
                  const Icon = node.icon;
                  const showTooltip = i === 2; // Retriever node

                  return (
                    <div
                      key={node.label}
                      className="flex items-center gap-1 sm:gap-2 flex-1 last:flex-none"
                    >
                      {/* Node */}
                      <div className="relative flex flex-col items-center gap-1.5">
                        <div className="size-11 sm:size-12 rounded-lg border border-black/[0.08] bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                          <Icon className="size-4 text-black/50" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-black/35 font-medium">
                          {node.label}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-black/25 font-mono truncate max-w-[80px]">
                          {node.detail}
                        </span>

                        {/* Wire Tap tooltip on Retriever→Reranker connection */}
                        {showTooltip && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/3 hidden sm:block">
                            <div className="bg-black text-white text-[9px] font-mono px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
                              docs: 5 · top_score: 0.94 · 156ms
                            </div>
                            <div className="w-1.5 h-1.5 bg-black rotate-45 absolute -bottom-[3px] left-1/2 -translate-x-1/2" />
                          </div>
                        )}
                      </div>

                      {/* Connector */}
                      {i < PIPELINE_NODES.length - 1 && (
                        <div className="flex-1 flex items-center justify-center min-w-[12px] sm:min-w-[20px]">
                          <div className="w-full h-[1.5px] bg-black/[0.1] relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1 rounded-full bg-black/20" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-black/[0.06] bg-black/[0.01]">
              <span className="text-[10px] text-black/30">
                5 nodes &middot; 4 connections
              </span>
              <div className="flex items-center gap-3 text-[10px] text-black/30">
                <span>latency: 245ms</span>
                <span className="text-emerald-600 font-medium">
                  pipeline healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
