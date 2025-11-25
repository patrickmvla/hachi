import { GitBranch } from "lucide-react";

export function Templates() {
  return (
    <section className="py-20 px-6 border-t">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Start with reference architectures
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Load production-grade patterns. Run them. Inspect them. Modify them. Learn how they work.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ArchitectureCard
            name="Naive RAG"
            description="Basic retrieve + generate baseline"
          />
          <ArchitectureCard
            name="HyDE Pipeline"
            description="Query expansion via hypothetical documents"
          />
          <ArchitectureCard
            name="Hybrid Search"
            description="BM25 + Vector + RRF + Reranker"
          />
          <ArchitectureCard
            name="CRAG Pipeline"
            description="Self-correcting with web search fallback"
          />
          <ArchitectureCard
            name="Parent-Child"
            description="Precision retrieval with context"
          />
          <ArchitectureCard
            name="Agentic RAG"
            description="Agent with retrieval tool"
          />
        </div>
      </div>
    </section>
  );
}

function ArchitectureCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border bg-background hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 mb-2">
        <GitBranch className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <h4 className="font-semibold">{name}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
