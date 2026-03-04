import type { CanvasNode, CanvasEdge } from "@hachi/mastra-core/compiler";

/**
 * Maps frontend node types to compiler/runner node types.
 * The canvas UI stores: embedding, retriever, reranker, llm
 * The compiler expects: embed, retrieve, rerank, generate
 */

const FRONTEND_TO_BACKEND_TYPE: Record<string, string> = {
  embedding: "embed",
  retriever: "retrieve",
  reranker: "rerank",
  llm: "generate",
};

/**
 * Transforms a graph from frontend format to execution format.
 * Remaps node types that differ between the canvas UI and the compiler.
 */
export const transformGraphForExecution = (graphJson: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}): { nodes: CanvasNode[]; edges: CanvasEdge[] } => {
  const nodes = graphJson.nodes.map((node) => {
    const mappedType = FRONTEND_TO_BACKEND_TYPE[node.type];
    if (!mappedType) return node;

    return {
      ...node,
      type: mappedType as CanvasNode["type"],
      data: {
        ...node.data,
        type: mappedType,
      },
    };
  });

  return { nodes, edges: graphJson.edges };
};
