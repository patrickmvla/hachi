/**
 * Get initial graph structure for a template
 * TODO: Replace with actual template data from API
 */
export function getTemplateGraph(templateId: string): { nodes: unknown[]; edges: unknown[] } {
  const templateGraphs: Record<string, { nodes: unknown[]; edges: unknown[] }> = {
    "tmpl-1": {
      // Naive RAG
      nodes: [
        { id: "1", type: "query", position: { x: 100, y: 200 }, data: { label: "Query", type: "query" } },
        { id: "2", type: "retriever", position: { x: 350, y: 200 }, data: { label: "Retriever", type: "retriever" } },
        { id: "3", type: "llm", position: { x: 600, y: 200 }, data: { label: "LLM", type: "llm" } },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2", type: "data" },
        { id: "e2-3", source: "2", target: "3", type: "data" },
      ],
    },
    "tmpl-2": {
      // HyDE
      nodes: [
        { id: "1", type: "query", position: { x: 100, y: 200 }, data: { label: "Query", type: "query" } },
        { id: "2", type: "hyde", position: { x: 300, y: 200 }, data: { label: "HyDE", type: "hyde" } },
        { id: "3", type: "embedding", position: { x: 500, y: 200 }, data: { label: "Embedding", type: "embedding" } },
        { id: "4", type: "retriever", position: { x: 700, y: 200 }, data: { label: "Retriever", type: "retriever" } },
        { id: "5", type: "llm", position: { x: 900, y: 200 }, data: { label: "LLM", type: "llm" } },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2", type: "data" },
        { id: "e2-3", source: "2", target: "3", type: "data" },
        { id: "e3-4", source: "3", target: "4", type: "data" },
        { id: "e4-5", source: "4", target: "5", type: "data" },
      ],
    },
  };

  return templateGraphs[templateId] || { nodes: [], edges: [] };
}
