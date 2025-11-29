import { Box, Lightbulb, GitFork, Merge, Scale, RefreshCw, Bot } from "lucide-react";
import { PatternCard } from "./shared";

export const AdvancedPatternsSection = () => {
  return (
    <section id="patterns" className="py-24 px-6 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6 mx-auto">
            <Box className="size-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Advanced RAG Patterns</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-built nodes for sophisticated retrieval patterns. Each encapsulates a proven technique
            you can understand by running and inspecting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PatternCard
            icon={<Lightbulb className="size-6" />}
            name="HyDE"
            fullName="Hypothetical Document Embeddings"
            description="Generate a hypothetical answer to improve embedding quality for short queries. The LLM creates a fake document that would answer the query, then we embed that instead."
            color="blue"
            benefits={["Better retrieval for short queries", "Reduces embedding mismatch", "Works with any embedding model"]}
          />
          <PatternCard
            icon={<GitFork className="size-6" />}
            name="Parent-Child"
            fullName="Hierarchical Chunking"
            description="Match on small, precise chunks but return their parent chunks for context. Get the precision of small chunks with the context of large ones."
            color="purple"
            benefits={["Precise matching", "Rich context", "Reduces hallucination"]}
          />
          <PatternCard
            icon={<Merge className="size-6" />}
            name="Fusion"
            fullName="Reciprocal Rank Fusion"
            description="Combine multiple retrieval methods (BM25, vector search, etc.) using reciprocal rank fusion. Get the best of lexical and semantic search."
            color="green"
            benefits={["Hybrid search", "Better recall", "More robust results"]}
          />
          <PatternCard
            icon={<Scale className="size-6" />}
            name="Judge (CRAG)"
            fullName="Corrective RAG"
            description="Evaluate retrieved documents for relevance before passing to the LLM. Route to fallback (like web search) if retrieval quality is low."
            color="orange"
            benefits={["Self-correcting", "Quality assurance", "Fallback handling"]}
          />
          <PatternCard
            icon={<RefreshCw className="size-6" />}
            name="Reranker"
            fullName="Cross-encoder Reranking"
            description="Use a cross-encoder model to rerank initial retrieval results. More accurate than embedding similarity alone."
            color="pink"
            benefits={["Higher precision", "Better top-k results", "Cross-encoder accuracy"]}
          />
          <PatternCard
            icon={<Bot className="size-6" />}
            name="Agentic RAG"
            fullName="Agent with Retrieval Tool"
            description="Give an LLM agent access to retrieval as a tool. The agent decides when to search, what to search for, and when to stop."
            color="cyan"
            benefits={["Dynamic retrieval", "Multi-step reasoning", "Self-directed search"]}
          />
        </div>
      </div>
    </section>
  );
};
