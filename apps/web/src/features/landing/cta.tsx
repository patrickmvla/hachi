import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-black">
      <div className="relative max-w-[600px] mx-auto text-center">
        <p className="text-[clamp(1.25rem,3vw,1.75rem)] text-white/60 mb-10">
          hachi is free during beta.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.3)]"
          >
            Get started
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/mini-map"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 transition-all"
          >
            Try playground
            <ArrowRight className="size-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  );
};
