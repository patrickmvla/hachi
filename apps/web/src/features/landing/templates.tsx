import Link from "next/link";
import { Layers, Lightbulb, Search, ArrowRight, LayoutTemplate } from "lucide-react";

const featuredTemplates = [
  {
    name: "Naive RAG",
    description: "Basic retrieve + generate",
    icon: Layers,
  },
  {
    name: "HyDE Pipeline",
    description: "Query expansion",
    icon: Lightbulb,
  },
  {
    name: "Hybrid Search",
    description: "BM25 + Vector + Reranker",
    icon: Search,
  },
];

export const Templates = () => {
  return (
    <section className="py-24 px-6 border-t">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div className="lg:max-w-xl">
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start with reference architectures
            </h2>
            <p className="text-muted-foreground text-lg">
              Load production-grade patterns. Run them. Inspect them. Modify them.
            </p>
          </div>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl border border-border/50 hover:bg-accent hover:border-accent transition-all shrink-0"
          >
            <LayoutTemplate className="size-5" />
            View all templates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Preview grid - just 3 featured templates */}
        <div className="grid sm:grid-cols-3 gap-5">
          {featuredTemplates.map((template) => (
            <Link
              key={template.name}
              href="/templates"
              className="group p-5 rounded-xl border bg-background hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <template.icon className="size-5 text-primary" />
              </div>
              <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {template.name}
              </h4>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </Link>
          ))}
        </div>

        {/* "And more" indicator */}
        <div className="mt-6 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span>+ 3 more templates including CRAG, Parent-Child, and Agentic RAG</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};
