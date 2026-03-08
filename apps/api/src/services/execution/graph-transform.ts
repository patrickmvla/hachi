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
 * Resolves the backend type for an evaluator node based on its config.metric.
 * The frontend uses a single "evaluator" type with a metric selector in config.
 */
function resolveEvaluatorType(
  config?: Record<string, unknown>
): string {
  const metric = config?.metric as string | undefined;
  switch (metric) {
    case "relevancy":
      return "eval-relevancy";
    case "context_precision":
      return "eval-context-precision";
    case "faithfulness":
    default:
      return "eval-faithfulness";
  }
}

/**
 * Transforms a graph from frontend format to execution format.
 * Remaps node types that differ between the canvas UI and the compiler.
 */
export const transformGraphForExecution = (graphJson: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}): { nodes: CanvasNode[]; edges: CanvasEdge[] } => {
  const nodes = graphJson.nodes.map((node) => {
    // Handle evaluator nodes with dynamic type resolution
    if (node.type === "evaluator") {
      const resolvedType = resolveEvaluatorType(node.data.config);
      return {
        ...node,
        type: resolvedType as CanvasNode["type"],
        data: {
          ...node.data,
          type: resolvedType,
        },
      };
    }

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
