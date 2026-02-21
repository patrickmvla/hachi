import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const FeaturesCTA = () => {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-[-0.03em] leading-[1.15] text-white mb-4">
          Debug your first pipeline in 5 minutes
        </h2>
        <p className="text-[15px] text-white/35 mb-10 leading-relaxed">
          No signup required. Your API keys stay local. Start with a blank canvas or a pre-built pattern.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/mini-map"
            className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold rounded-full bg-white text-black hover:bg-white/90 transition-all"
          >
            Open Sandbox
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/mini-map?template=hyde"
            className="group inline-flex items-center gap-2 px-7 py-3 text-[14px] font-medium rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 transition-all"
          >
            Try HyDE Pattern
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-white/20">
          <span>Open Source</span>
          <span>&middot;</span>
          <span>MIT License</span>
          <span>&middot;</span>
          <span>Self-hostable</span>
        </div>
      </div>
    </section>
  );
};
