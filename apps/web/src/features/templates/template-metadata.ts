export interface TemplateMetadata {
  whenToUse: string;
  keyInsight: string;
  paperRef?: string;
}

export const TEMPLATE_METADATA: Record<string, TemplateMetadata> = {
  "naive-rag": {
    whenToUse: "Simple document Q&A with well-formed queries",
    keyInsight:
      "Baseline for comparison — every RAG pipeline starts here. No quality checks or query transformation.",
    paperRef: "Lewis et al., 2020",
  },
  "rag-reranking": {
    whenToUse: "When retrieval precision matters more than speed",
    keyInsight:
      "Reranking consistently improves results across configurations — the single most reliable RAG enhancement.",
    paperRef: "Xiao et al., 2023 (BGE); ACL 2025 Findings",
  },
  hyde: {
    whenToUse: "Short, ambiguous queries that lack domain vocabulary",
    keyInsight:
      "Embedding a hypothetical answer produces a richer vector than embedding the query directly.",
    paperRef: "Gao et al., 2022",
  },
  "agentic-rag": {
    whenToUse:
      "Open-ended questions where retrieval strategy isn't known upfront",
    keyInsight:
      "ReAct loop (Reason → Act → Observe) lets the agent plan its own retrieval strategy autonomously.",
    paperRef: "Yao et al., 2022",
  },
  "advanced-rag": {
    whenToUse:
      "General-purpose upgrade over Naive RAG — handles imprecise queries and noisy retrieval",
    keyInsight:
      "Query rewriting + reranking are the two most impactful improvements over the baseline.",
    paperRef: "Gao et al. survey, 2024",
  },
  "rag-fusion": {
    whenToUse:
      "When a single query perspective misses relevant documents",
    keyInsight:
      "Multiple query variants retrieve from different angles; Reciprocal Rank Fusion merges without tuning.",
    paperRef: "Rackauckas, 2024",
  },
  "step-back-rag": {
    whenToUse:
      "Detailed or narrow questions that need broader foundational context",
    keyInsight:
      "Abstracting the question retrieves principles, not just specifics — +27% on TimeQA.",
    paperRef: "Zheng et al., 2023 (Google DeepMind)",
  },
  crag: {
    whenToUse:
      "When your knowledge base may not have the answer and you need a fallback",
    keyInsight:
      "A lightweight evaluator scores retrieval quality; irrelevant results trigger query rewriting or web search.",
    paperRef: "Yan et al., 2024",
  },
  "self-rag": {
    whenToUse:
      "High-stakes generation where hallucination must be minimized",
    keyInsight:
      "Inline reflection tokens let the model self-evaluate retrieval relevance and output groundedness.",
    paperRef: "Asai et al., 2023 (ICLR 2024 Oral)",
  },
  "iterative-rag": {
    whenToUse:
      "Questions requiring refinement — first-pass answers need improvement",
    keyInsight:
      "The retrieve→generate→evaluate→improve loop converges on higher-quality answers with each iteration.",
    paperRef: "Iter-RetGen / IRCoT, 2023",
  },
  "adaptive-rag": {
    whenToUse:
      "Mixed-complexity workloads — simple queries skip retrieval, complex ones get multi-step",
    keyInsight:
      "Query classification has outsized impact — deciding IF retrieval is needed matters more than most other components.",
    paperRef: "Jeong et al., 2024 (NAACL)",
  },
  "multi-hop": {
    whenToUse:
      'Complex questions requiring evidence from multiple documents — "Compare X and Y"',
    keyInsight:
      "Decomposing into sub-queries and retrieving evidence for each in parallel, then fusing results.",
    paperRef: "IRCoT / PruneRAG, 2022–2026",
  },
};
