import { Code2, GitBranch, Cpu, Database } from "lucide-react";

export const FeaturesHero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          <Code2 className="size-3.5 text-primary" />
          <span>Built by RAG engineers, for RAG engineers</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            Debug retrieval failures.
          </span>
          <br />
          <span className="text-foreground">
            Benchmark patterns. Ship with confidence.
          </span>
        </h1>

        {/* Subtitle with concrete problem */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Stop guessing why cosine similarity returned 0.3. See exact embedding vectors,
          chunk boundaries, and reranker scores. Debug RAG pipelines like you debug code.
        </p>

        {/* Tech stack indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GitBranch className="size-4" />
            <span>TypeScript-first</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Cpu className="size-4" />
            <span>React Flow</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Database className="size-4" />
            <span>OpenAI · Anthropic · Pinecone</span>
          </div>
        </div>
      </div>
    </section>
  );
};
