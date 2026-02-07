import Link from "next/link";
import { ArrowRight, Github, BookOpen, Terminal } from "lucide-react";

export const FeaturesCTA = () => {
  return (
    <section className="relative py-24 px-6 border-t overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Debug your first RAG pipeline in 5 minutes
        </h2>
        <p className="text-muted-foreground text-lg mb-4 max-w-xl mx-auto leading-relaxed">
          No signup required. Your API keys stay local. Start with a blank canvas or try a pre-built pattern.
        </p>

        {/* Credibility badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50">
            <Github className="size-3.5" />
            Open Source
          </span>
          <span className="px-3 py-1 rounded-full bg-muted/50">MIT License</span>
          <span className="px-3 py-1 rounded-full bg-muted/50">Self-hostable</span>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/sandbox"
            className="group inline-flex items-center gap-2 px-10 py-5 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Open Sandbox
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/sandbox?template=hyde"
            className="inline-flex items-center gap-2 px-8 py-5 text-lg font-medium rounded-xl border border-border/50 hover:bg-accent transition-all"
          >
            Try HyDE Pattern
          </Link>
        </div>

        {/* Secondary links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="size-4" />
            Read the docs
          </Link>
          <Link
            href="https://github.com/hachi-rag/hachi"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-4" />
            View on GitHub
          </Link>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Terminal className="size-4" />
            <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">npx create-hachi-app</code>
          </div>
        </div>
      </div>
    </section>
  );
};
