import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 px-6 border-t overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          <Sparkles className="size-3.5 text-primary" />
          <span>Free to get started</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to understand your
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            RAG pipeline?
          </span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Stop guessing. Start seeing. Design architectures you can actually debug.
        </p>
        <Link
          href="/canvas"
          className="group inline-flex items-center gap-2 px-10 py-5 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          Open Canvas
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
