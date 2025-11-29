import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          <Sparkles className="size-3.5 text-primary" />
          <span>For engineers building production RAG systems</span>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Design RAG architectures
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            you can actually debug
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Hachi is a visual platform where engineering teams design, execute, and
          debug advanced RAG pipelines. See exactly why your retrieval fails.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Start Building
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl border border-border/50 hover:bg-accent hover:border-accent transition-all"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
};
