import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export const TemplatesCTA = () => {
  return (
    <section className="py-20 px-6 border-t bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Don&apos;t see what you need?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Start from scratch and build your own custom RAG architecture.
          Combine any nodes to create the perfect pipeline for your use case.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Plus className="size-5" />
            Start from Scratch
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-6 py-4 text-base font-medium rounded-xl border border-border/50 hover:bg-accent transition-all"
          >
            Explore Features
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
