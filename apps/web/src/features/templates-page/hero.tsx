import { LayoutTemplate } from "lucide-react";

export function TemplatesHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          <LayoutTemplate className="size-3.5 text-primary" />
          <span>Reference Architectures</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Start with proven
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            RAG patterns
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Load production-grade architectures. Run them against your data.
          Inspect every step. Modify and learn.
        </p>
      </div>
    </section>
  );
}
