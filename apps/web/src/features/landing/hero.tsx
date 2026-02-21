"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const PIPELINE_STEPS = [
  { id: "Q", label: "Query", color: "#2563eb" },
  { id: "E", label: "Embed", color: "#7c3aed" },
  { id: "R", label: "Retrieve", color: "#059669" },
  { id: "G", label: "Generate", color: "#d97706" },
] as const;

export const Hero = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? -1 : prev + 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Geometric accent - top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 600 600" fill="none">
          <circle cx="600" cy="0" r="300" stroke="black" strokeWidth="1" />
          <circle cx="600" cy="0" r="200" stroke="black" strokeWidth="1" />
          <circle cx="600" cy="0" r="100" stroke="black" strokeWidth="1" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 pt-32 pb-20 text-center">
        {/* Overline */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] mb-10"
          style={mounted ? { animation: "fadeInUp 0.7s ease-out forwards" } : { opacity: 0 }}
        >
          <div className="size-1.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] tracking-wide text-black/50 uppercase">Visual RAG Architecture Platform</span>
        </div>

        {/* Main heading */}
        <h1
          className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.035em] leading-[1.05] text-black mb-8"
          style={mounted ? { animation: "fadeInUp 0.7s ease-out 100ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          Design RAG pipelines<br />
          <span className="relative">
            you can see through
            <svg className="absolute -bottom-1 left-0 w-full h-2 text-blue-500/30" viewBox="0 0 300 8" preserveAspectRatio="none">
              <path d="M0 5 Q75 0 150 5 Q225 8 300 3" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-[17px] sm:text-[19px] leading-relaxed text-black/45 max-w-[560px] mx-auto mb-14"
          style={mounted ? { animation: "fadeInUp 0.7s ease-out 200ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          Hachi lets engineering teams visually design, execute, and debug
          advanced retrieval pipelines. See exactly where and why things fail.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          style={mounted ? { animation: "fadeInUp 0.7s ease-out 300ms forwards", opacity: 0 } : { opacity: 0 }}
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold rounded-full bg-black text-white hover:bg-black/85 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]"
          >
            Get started
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/features"
            className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-medium rounded-full border border-black/10 text-black/70 hover:border-black/20 hover:text-black hover:bg-black/[0.02] transition-all"
          >
            How it works
            <ArrowDown className="size-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
          </Link>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div
        className="relative w-full max-w-[700px] mx-auto px-6 pb-24"
        style={mounted ? { animation: "fadeInUp 0.8s ease-out 500ms forwards", opacity: 0 } : { opacity: 0 }}
      >
        <div className="relative rounded-2xl border border-black/[0.08] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
            <div className="flex items-center gap-1.5">
              <div className="size-[9px] rounded-full bg-black/10" />
              <div className="size-[9px] rounded-full bg-black/10" />
              <div className="size-[9px] rounded-full bg-black/10" />
            </div>
            <span className="text-[11px] text-black/30 tracking-wide">naive-rag.hachi</span>
            <div className="flex items-center gap-1.5 text-[11px] text-black/30">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              ready
            </div>
          </div>

          {/* Pipeline flow */}
          <div className="px-8 py-10 sm:py-14">
            <div className="flex items-center justify-between gap-2 sm:gap-0">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
                  {/* Node */}
                  <div className="flex flex-col items-center gap-2.5">
                    <div
                      className="relative size-12 sm:size-14 rounded-xl border-2 flex items-center justify-center transition-all duration-500"
                      style={{
                        borderColor: activeStep >= i ? step.color : "rgba(0,0,0,0.08)",
                        backgroundColor: activeStep >= i ? `${step.color}08` : "transparent",
                        boxShadow: activeStep === i ? `0 0 0 4px ${step.color}15, 0 4px 16px ${step.color}20` : "none",
                      }}
                    >
                      <span
                        className="text-sm font-bold transition-colors duration-500"
                        style={{ color: activeStep >= i ? step.color : "rgba(0,0,0,0.25)" }}
                      >
                        {step.id}
                      </span>
                    </div>
                    <span
                      className="text-[10px] sm:text-[11px] tracking-wide uppercase transition-colors duration-500"
                      style={{ color: activeStep >= i ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.25)" }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] rounded-full bg-black/[0.06] relative mx-1 sm:mx-0 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: activeStep > i ? "100%" : "0%",
                          backgroundColor: PIPELINE_STEPS[i + 1]?.color,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.06] bg-black/[0.01]">
            <span className="text-[11px] text-black/30">4 nodes &middot; 3 connections</span>
            <div className="flex items-center gap-3 text-[11px] text-black/30">
              <span>latency: 245ms</span>
              <span className="text-emerald-600 font-medium">pipeline healthy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
