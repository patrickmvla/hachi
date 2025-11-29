import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const FeaturesCTA = () => {
  return (
    <section className="relative py-24 px-6 border-t overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to build better RAG?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Start designing, debugging, and understanding your RAG pipelines today. Free to get started.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 px-10 py-5 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Open Canvas
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-5 text-lg font-medium rounded-xl border border-border/50 hover:bg-accent transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};
