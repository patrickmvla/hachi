"use client";

import { useState } from "react";
import { LayoutTemplate, ChevronDown } from "lucide-react";
import { useCanvasStore, type HachiNode, type HachiEdge } from "@/stores/canvas-store";
import { nodeDefaults } from "../config/node-defaults";

export interface Template {
  id: string;
  name: string;
  description: string;
  defaultQuery: string;
  nodes: Array<{ id: string; type: string; position: { x: number; y: number }; data: { label: string; type: string; config?: Record<string, unknown> } }>;
  edges: Array<{ id: string; source: string; target: string; type: string }>;
}

export const templates: Template[] = [
  {
    id: "naive-rag",
    name: "Naive RAG",
    description: "Simple retrieval and generation",
    defaultQuery: "What are the benefits of vector databases?",
    nodes: [
      { id: "1", type: "query", position: { x: 100, y: 100 }, data: { label: "User Query", type: "query", config: { ...nodeDefaults.query } } },
      { id: "2", type: "embedding", position: { x: 100, y: 300 }, data: { label: "Embed Query", type: "embedding", config: { ...nodeDefaults.embedding } } },
      { id: "3", type: "retriever", position: { x: 100, y: 500 }, data: { label: "Retrieve Docs", type: "retriever", config: { ...nodeDefaults.retriever } } },
      { id: "4", type: "llm", position: { x: 100, y: 700 }, data: { label: "Generate Answer", type: "llm", config: { ...nodeDefaults.llm } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", type: "data" },
      { id: "e2-3", source: "2", target: "3", type: "data" },
      { id: "e3-4", source: "3", target: "4", type: "data" },
    ]
  },
  {
    id: "hyde",
    name: "HyDE RAG",
    description: "Hypothetical Document Embeddings",
    defaultQuery: "How does transformer attention work?",
    nodes: [
      { id: "1", type: "query", position: { x: 100, y: 100 }, data: { label: "User Query", type: "query", config: { ...nodeDefaults.query } } },
      { id: "2", type: "hyde", position: { x: 100, y: 300 }, data: { label: "Generate Hypothetical", type: "hyde", config: { ...nodeDefaults.hyde } } },
      { id: "3", type: "embedding", position: { x: 100, y: 500 }, data: { label: "Embed Both", type: "embedding", config: { ...nodeDefaults.embedding } } },
      { id: "4", type: "retriever", position: { x: 100, y: 700 }, data: { label: "Retrieve Docs", type: "retriever", config: { ...nodeDefaults.retriever } } },
      { id: "5", type: "llm", position: { x: 100, y: 900 }, data: { label: "Generate Answer", type: "llm", config: { ...nodeDefaults.llm } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", type: "data" },
      { id: "e2-3", source: "2", target: "3", type: "data" },
      { id: "e3-4", source: "3", target: "4", type: "data" },
      { id: "e4-5", source: "4", target: "5", type: "data" },
    ]
  },
  {
    id: "rag-reranking",
    name: "RAG + Reranking",
    description: "Retrieval with reranking for better relevance",
    defaultQuery: "Explain the difference between L1 and L2 regularization",
    nodes: [
      { id: "1", type: "query", position: { x: 100, y: 100 }, data: { label: "User Query", type: "query", config: { ...nodeDefaults.query } } },
      { id: "2", type: "embedding", position: { x: 100, y: 300 }, data: { label: "Embed Query", type: "embedding", config: { ...nodeDefaults.embedding } } },
      { id: "3", type: "retriever", position: { x: 100, y: 500 }, data: { label: "Retrieve Docs", type: "retriever", config: { ...nodeDefaults.retriever } } },
      { id: "4", type: "reranker", position: { x: 100, y: 700 }, data: { label: "Rerank Results", type: "reranker", config: { ...nodeDefaults.reranker } } },
      { id: "5", type: "llm", position: { x: 100, y: 900 }, data: { label: "Generate Answer", type: "llm", config: { ...nodeDefaults.llm } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", type: "data" },
      { id: "e2-3", source: "2", target: "3", type: "data" },
      { id: "e3-4", source: "3", target: "4", type: "data" },
      { id: "e4-5", source: "4", target: "5", type: "data" },
    ]
  },
  {
    id: "agentic-rag",
    name: "Agentic RAG",
    description: "Agent-driven retrieval with quality judging",
    defaultQuery: "What are best practices for prompt engineering?",
    nodes: [
      { id: "1", type: "query", position: { x: 100, y: 100 }, data: { label: "User Query", type: "query", config: { ...nodeDefaults.query } } },
      { id: "2", type: "agent", position: { x: 100, y: 300 }, data: { label: "Plan Retrieval", type: "agent", config: { ...nodeDefaults.agent } } },
      { id: "3", type: "retriever", position: { x: 100, y: 500 }, data: { label: "Retrieve Docs", type: "retriever", config: { ...nodeDefaults.retriever } } },
      { id: "4", type: "judge", position: { x: 100, y: 700 }, data: { label: "Judge Relevance", type: "judge", config: { ...nodeDefaults.judge } } },
      { id: "5", type: "llm", position: { x: 100, y: 900 }, data: { label: "Generate Answer", type: "llm", config: { ...nodeDefaults.llm } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", type: "data" },
      { id: "e2-3", source: "2", target: "3", type: "data" },
      { id: "e3-4", source: "3", target: "4", type: "data" },
      { id: "e4-5", source: "4", target: "5", type: "data" },
    ]
  }
];

export const TemplateLoader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes, setEdges } = useCanvasStore();

  const loadTemplate = (template: Template) => {
    setNodes(template.nodes as HachiNode[]);
    setEdges(template.edges as HachiEdge[]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <LayoutTemplate size={16} aria-hidden="true" />
        Templates
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-label="Template options"
        >
          <div className="p-2">
            <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
              Load Template
            </div>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template)}
                className="w-full text-left px-2 py-2 hover:bg-muted rounded-md transition-colors"
                role="menuitem"
              >
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
