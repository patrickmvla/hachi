"use client";

import Link from "next/link";
import { ArrowRight, Zap, Terminal } from "lucide-react";

export const CTA = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern */}
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
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 60%)",
          }}
        />
        {/* Corner glows */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Terminal-style container */}
        <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-muted/30">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-mono">ready_to_build.sh</span>
            </div>
            <Terminal className="size-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="p-10 sm:p-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-medium mb-8">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FREE_TO_START</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to understand your
              <br />
              <span className="text-primary">RAG pipeline?</span>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Stop guessing. Start seeing. Design architectures you can actually debug.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sandbox"
                className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-medium rounded-lg overflow-hidden transition-all"
              >
                {/* Button background with glow */}
                <span className="absolute inset-0 bg-primary" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 shadow-[0_0_60px_hsl(var(--primary))] opacity-40 group-hover:opacity-60 transition-opacity" />
                {/* Button content */}
                <span className="relative flex items-center gap-3 text-primary-foreground">
                  <Zap className="size-5" />
                  Open Canvas
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-5 text-lg font-medium rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                Create Account
                <ArrowRight className="size-5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Subtext */}
            <p className="mt-8 text-sm text-muted-foreground">
              No credit card required. Start building in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
