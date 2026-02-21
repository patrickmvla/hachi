"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="relative py-28 sm:py-36 px-6 bg-black overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.04] rounded-full blur-[120px]" />

      <div className="relative max-w-[600px] mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] mb-10">
          <div className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-[12px] tracking-wide text-white/50 uppercase">Free to start</span>
        </div>

        {/* Heading */}
        <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-white mb-6">
          Ready to see through<br />
          your RAG pipeline?
        </h2>

        {/* Description */}
        <p className="text-[16px] sm:text-[17px] leading-relaxed text-white/40 mb-12 max-w-[440px] mx-auto">
          Stop guessing. Start seeing. Design architectures you can actually debug.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/mini-map"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.3)]"
          >
            Try Playground
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 transition-all"
          >
            Create account
            <ArrowRight className="size-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
          </Link>
        </div>

        {/* Subtext */}
        <p className="mt-8 text-[12px] text-white/20">
          No credit card required. Start building in seconds.
        </p>
      </div>
    </section>
  );
};
