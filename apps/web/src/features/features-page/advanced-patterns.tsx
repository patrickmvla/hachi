import { Lightbulb, GitFork, Merge, Scale, RefreshCw, Bot } from "lucide-react";
import { PatternCard } from "./shared";

export const AdvancedPatternsSection = () => {
  return (
    <section id="patterns" className="py-20 px-6 bg-white scroll-mt-16">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="max-w-[520px] mb-14">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
            RAG Patterns
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
            Advanced patterns, pre-built
          </h2>
          <p className="text-[15px] text-black/40 leading-relaxed">
            Pre-built nodes for sophisticated retrieval patterns. Each encapsulates a proven technique
            with real performance benchmarks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PatternCard
            icon={<Lightbulb className="size-5" />}
            name="HyDE"
            fullName="Hypothetical Document Embeddings"
            description="Generate a hypothetical answer to improve embedding quality for short queries."
            color="#2563eb"
            benefits={["Better retrieval for short queries", "Reduces embedding mismatch", "Works with any embedding model"]}
            benchmark="+15-30% recall"
            sandboxTemplate="hyde"
          />
          <PatternCard
            icon={<GitFork className="size-5" />}
            name="Parent-Child"
            fullName="Hierarchical Chunking"
            description="Match on small, precise chunks but return their parent chunks for context."
            color="#7c3aed"
            benefits={["Precise matching", "Rich context", "Reduces hallucination"]}
            benchmark="2x context"
            sandboxTemplate="parent-child"
          />
          <PatternCard
            icon={<Merge className="size-5" />}
            name="Fusion"
            fullName="Reciprocal Rank Fusion"
            description="Combine multiple retrieval methods using reciprocal rank fusion."
            color="#059669"
            benefits={["Hybrid search", "Better recall", "More robust results"]}
            benchmark="+12% MRR"
            sandboxTemplate="fusion"
          />
          <PatternCard
            icon={<Scale className="size-5" />}
            name="Judge (CRAG)"
            fullName="Corrective RAG"
            description="Evaluate retrieved documents for relevance before passing to the LLM."
            color="#d97706"
            benefits={["Self-correcting", "Quality assurance", "Fallback handling"]}
            benchmark="-40% hallucination"
            sandboxTemplate="crag"
          />
          <PatternCard
            icon={<RefreshCw className="size-5" />}
            name="Reranker"
            fullName="Cross-encoder Reranking"
            description="Use a cross-encoder model to rerank initial retrieval results."
            color="#ec4899"
            benefits={["Higher precision", "Better top-k results", "Cross-encoder accuracy"]}
            benchmark="3x precision"
            sandboxTemplate="reranker"
          />
          <PatternCard
            icon={<Bot className="size-5" />}
            name="Agentic RAG"
            fullName="Agent with Retrieval Tool"
            description="Give an LLM agent access to retrieval as a tool for dynamic, multi-step search."
            color="#06b6d4"
            benefits={["Dynamic retrieval", "Multi-step reasoning", "Self-directed search"]}
            benchmark="+50% accuracy"
            sandboxTemplate="agentic"
          />
        </div>
      </div>
    </section>
  );
};
