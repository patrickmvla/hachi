import type { TemplateData } from "./template-card";
import {
  NaiveRAGDiagram,
  HyDEDiagram,
  HybridSearchDiagram,
  CRAGDiagram,
  ParentChildDiagram,
  AgenticRAGDiagram,
} from "./template-diagrams";

export const templates: TemplateData[] = [
  {
    id: "naive-rag",
    name: "Naive RAG",
    description: "The classic retrieve-and-generate baseline",
    longDescription:
      "The simplest RAG pattern. Embed the query, retrieve similar documents from your vector store, and pass them to an LLM with your question. Perfect for getting started and establishing a baseline.",
    complexity: "Beginner",
    estimatedTime: "5 min setup",
    nodes: ["Query", "Retriever", "LLM", "Output"],
    useCases: ["Quick prototypes", "Simple Q&A", "Baseline comparison"],
    diagram: <NaiveRAGDiagram />,
  },
  {
    id: "hyde",
    name: "HyDE Pipeline",
    description: "Query expansion via hypothetical documents",
    longDescription:
      "Hypothetical Document Embeddings (HyDE) improves retrieval for short or ambiguous queries. The LLM first generates a hypothetical answer, which is then embedded and used for retrieval. This bridges the gap between query and document embeddings.",
    complexity: "Intermediate",
    estimatedTime: "10 min setup",
    nodes: ["Query", "HyDE Generator", "Embedding", "Retriever", "LLM", "Output"],
    useCases: ["Short queries", "Ambiguous questions", "Technical documentation"],
    diagram: <HyDEDiagram />,
  },
  {
    id: "hybrid-search",
    name: "Hybrid Search",
    description: "BM25 + Vector search with reranking",
    longDescription:
      "Combines the precision of keyword search (BM25) with the semantic understanding of vector search. Results are merged using Reciprocal Rank Fusion, then reranked with a cross-encoder for maximum accuracy.",
    complexity: "Intermediate",
    estimatedTime: "15 min setup",
    nodes: ["Query", "BM25", "Vector Search", "RRF Fusion", "Reranker", "LLM", "Output"],
    useCases: ["Enterprise search", "Mixed content types", "High-precision needs"],
    diagram: <HybridSearchDiagram />,
  },
  {
    id: "crag",
    name: "CRAG Pipeline",
    description: "Self-correcting RAG with fallback",
    longDescription:
      "Corrective RAG (CRAG) adds a judge node that evaluates retrieval quality. If documents are irrelevant, it falls back to web search. This self-correcting behavior prevents hallucinations from poor retrieval.",
    complexity: "Advanced",
    estimatedTime: "20 min setup",
    nodes: ["Query", "Retriever", "Judge", "Web Search", "LLM", "Output"],
    useCases: ["Production systems", "High-stakes answers", "Dynamic knowledge"],
    diagram: <CRAGDiagram />,
  },
  {
    id: "parent-child",
    name: "Parent-Child Retrieval",
    description: "Precision matching with full context",
    longDescription:
      "Index small chunks for precise matching, but return their parent chunks to the LLM. This gives you the retrieval precision of small chunks with the rich context of large documents.",
    complexity: "Advanced",
    estimatedTime: "15 min setup",
    nodes: ["Query", "Child Retriever", "Parent Lookup", "LLM", "Output"],
    useCases: ["Long documents", "Legal/medical text", "Context-heavy answers"],
    diagram: <ParentChildDiagram />,
  },
  {
    id: "agentic-rag",
    name: "Agentic RAG",
    description: "LLM agent with retrieval tool",
    longDescription:
      "Give an LLM agent access to retrieval as a tool. The agent decides when to search, what query to use, and whether it has enough information to answer. Enables multi-step reasoning and self-directed research.",
    complexity: "Advanced",
    estimatedTime: "25 min setup",
    nodes: ["Query", "Agent", "Retrieval Tool", "Reasoning Loop", "Output"],
    useCases: ["Complex research", "Multi-hop questions", "Open-ended exploration"],
    diagram: <AgenticRAGDiagram />,
  },
];
