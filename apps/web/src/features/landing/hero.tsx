"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Animated typing effect for the terminal
const TypeWriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse">_</span>
    </span>
  );
};

// Floating node component
const FloatingNode = ({
  label,
  color,
  position,
  delay,
}: {
  label: string;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
}) => (
  <div
    className="absolute hidden lg:block"
    style={{
      ...position,
      animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`,
      opacity: 0,
    }}
  >
    <div
      className={`px-3 py-1.5 rounded border backdrop-blur-sm text-xs font-medium ${color}`}
    >
      {label}
    </div>
  </div>
);

export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated grid background */}
      <div className="absolute inset-0 -z-10">
        {/* Base grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        {/* Radial gradient center glow */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)",
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating nodes - only render after mount to avoid hydration issues */}
      {mounted && (
        <>
          <FloatingNode
            label="QUERY"
            color="border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
            position={{ top: "20%", left: "10%" }}
            delay={800}
          />
          <FloatingNode
            label="EMBED"
            color="border-violet-500/50 bg-violet-500/10 text-violet-400"
            position={{ top: "35%", right: "12%" }}
            delay={1000}
          />
          <FloatingNode
            label="RETRIEVE"
            color="border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
            position={{ bottom: "30%", left: "8%" }}
            delay={1200}
          />
          <FloatingNode
            label="GENERATE"
            color="border-amber-500/50 bg-amber-500/10 text-amber-400"
            position={{ bottom: "25%", right: "15%" }}
            delay={1400}
          />
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Terminal badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-10"
          style={{ animation: "fadeInUp 0.6s ease-out 200ms forwards", opacity: 0 }}
        >
          <Terminal className="size-4 text-primary" />
          <span className="text-sm text-primary">
            {mounted ? <TypeWriter text="visual_rag_debugger --mode=production" delay={40} /> : "visual_rag_debugger --mode=production"}
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8"
          style={{ animation: "fadeInUp 0.6s ease-out 400ms forwards", opacity: 0 }}
        >
          <span className="block text-foreground">Design RAG architectures</span>
          <span className="block mt-2 relative">
            <span className="relative inline-block">
              <span className="text-primary">you can actually debug</span>
              {/* Underline glow effect */}
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            </span>
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ animation: "fadeInUp 0.6s ease-out 600ms forwards", opacity: 0 }}
        >
          Hachi is where engineering teams design, execute, and inspect advanced RAG
          pipelines. See exactly why your retrieval fails. Understand your system.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeInUp 0.6s ease-out 800ms forwards", opacity: 0 }}
        >
          <Link
            href="/sandbox"
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-base font-medium rounded-lg overflow-hidden transition-all"
          >
            {/* Button background with glow */}
            <span className="absolute inset-0 bg-primary" />
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 shadow-[0_0_40px_hsl(var(--primary))] opacity-30 group-hover:opacity-50 transition-opacity" />
            {/* Button content */}
            <span className="relative flex items-center gap-3 text-primary-foreground">
              <Zap className="size-4" />
              Start Building
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/features"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            See How It Works
            <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Animated flow diagram preview */}
        <div
          className="mt-20 relative"
          style={{ animation: "fadeInUp 0.6s ease-out 1000ms forwards", opacity: 0 }}
        >
          <div className="relative mx-auto max-w-3xl">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl -z-10" />

            {/* Flow diagram */}
            <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 overflow-hidden">
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  style={{ animation: "scan 3s linear infinite" }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Node: Query */}
                <div className="flex flex-col items-center gap-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-12 sm:size-14 rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center">
                      <span className="text-cyan-400 text-xs font-bold">Q</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Query</span>
                </div>

                {/* Connection */}
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500 to-violet-500/50 relative">
                  <div className="absolute inset-0 animate-pulse" />
                </div>

                {/* Node: Embed */}
                <div className="flex flex-col items-center gap-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-12 sm:size-14 rounded-lg border-2 border-violet-500/50 bg-violet-500/10 flex items-center justify-center">
                      <span className="text-violet-400 text-xs font-bold">E</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Embed</span>
                </div>

                {/* Connection */}
                <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 via-violet-500 to-emerald-500/50 relative">
                  <div className="absolute inset-0 animate-pulse" style={{ animationDelay: "200ms" }} />
                </div>

                {/* Node: Retrieve */}
                <div className="flex flex-col items-center gap-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-12 sm:size-14 rounded-lg border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs font-bold">R</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Retrieve</span>
                </div>

                {/* Connection */}
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-amber-500/50 relative">
                  <div className="absolute inset-0 animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>

                {/* Node: Generate */}
                <div className="flex flex-col items-center gap-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-12 sm:size-14 rounded-lg border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center">
                      <span className="text-amber-400 text-xs font-bold">G</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Generate</span>
                </div>
              </div>

              {/* Bottom status bar */}
              <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pipeline ready</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>4 nodes</span>
                  <span>3 connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
