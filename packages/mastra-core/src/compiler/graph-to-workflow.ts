import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  createQueryStep,
  createEmbedStep,
  createRetrieveStep,
  createGenerateStep,
  createHyDEStep,
  createRerankStep,
  createJudgeStep,
  createAgentStep,
  createEvalFaithfulnessStep,
  createEvalRelevancyStep,
  createEvalContextPrecisionStep,
} from "../steps";
import { validateCanvas, type CanvasNode, type CanvasEdge } from "./validate";
import { topologicalSort, type GraphNode, type GraphEdge } from "./topological-sort";
import type { NodeType } from "@hachi/schemas/nodes";

/**
 * Graph to Workflow Compiler (vNext)
 * Converts canvas JSON (React Flow format) to executable Mastra vNext workflow
 * using .then()/.parallel()/.map() chaining and workflow.stream()
 */

export interface CanvasGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface CompilationResult {
  success: boolean;
  workflow?: ReturnType<typeof createWorkflow>;
  executionOrder?: string[];
  errors?: string[];
  warnings?: string[];
}

// Keep for backward compat (Wire Tap uses this)
export interface ExecutionPlan {
  steps: ExecutionStep[];
  inputMapping: Map<string, string[]>;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  config: Record<string, unknown>;
  inputs: string[];
}

/**
 * Step factory registry - maps node types to step creators
 */
const STEP_FACTORIES: Record<NodeType, (config?: any) => any> = {
  query: createQueryStep,
  embed: createEmbedStep,
  retrieve: createRetrieveStep,
  generate: createGenerateStep,
  hyde: createHyDEStep,
  rerank: createRerankStep,
  judge: createJudgeStep,
  agent: createAgentStep,
  "eval-faithfulness": createEvalFaithfulnessStep,
  "eval-relevancy": createEvalRelevancyStep,
  "eval-context-precision": createEvalContextPrecisionStep,
};

/**
 * Maps upstream step outputs to the format expected by a given node type.
 * This is the data transformation layer between nodes.
 */
export function mapUpstreamOutputs(
  nodeType: NodeType,
  upstreamOutputs: Map<string, Record<string, unknown>>,
  initialQuery: string
): Record<string, unknown> {
  const outputs = Array.from(upstreamOutputs.values());

  switch (nodeType) {
    case "query":
      return { query: initialQuery };

    case "embed": {
      const queryOutput = outputs.find((o) => o?.query);
      const hydeOutput = outputs.find((o) => o?.hypotheticalDocuments);
      // HyDE produces hypotheticalDocuments array - use first one as text
      const hydeText =
        hydeOutput?.hypotheticalDocuments &&
        Array.isArray(hydeOutput.hypotheticalDocuments)
          ? hydeOutput.hypotheticalDocuments[0]
          : undefined;
      return {
        text: hydeText || queryOutput?.query || initialQuery,
      };
    }

    case "hyde": {
      const queryOutput = outputs.find((o) => o?.query);
      return { query: queryOutput?.query || initialQuery };
    }

    case "retrieve": {
      const embedOutput = outputs.find((o) => o?.embedding);
      const queryOutput = outputs.find((o) => o?.query);
      return {
        embedding: embedOutput?.embedding || [],
        query:
          queryOutput?.query || embedOutput?.text || initialQuery,
      };
    }

    case "rerank": {
      const docsOutput = outputs.find((o) => o?.documents);
      const queryOutput = outputs.find((o) => o?.query);
      return {
        documents: docsOutput?.documents || [],
        query:
          queryOutput?.query ||
          docsOutput?.query ||
          initialQuery,
      };
    }

    case "judge": {
      const docsOutput = outputs.find((o) => o?.documents);
      const queryOutput = outputs.find((o) => o?.query);
      return {
        documents: docsOutput?.documents || [],
        query:
          queryOutput?.query ||
          docsOutput?.query ||
          initialQuery,
      };
    }

    case "generate": {
      const retrieveOutput = outputs.find(
        (o) => o?.documents && !o?.rerankScore
      );
      const rerankOutput = outputs.find((o) =>
        Array.isArray(o?.documents) &&
        (o?.documents as any)?.[0]?.rerankScore !== undefined
      );
      const judgeOutput = outputs.find((o) => o?.relevantDocuments);
      const queryOutput = outputs.find((o) => o?.query);
      const documents =
        judgeOutput?.relevantDocuments ||
        rerankOutput?.documents ||
        retrieveOutput?.documents;
      return {
        query: queryOutput?.query || initialQuery,
        documents,
      };
    }

    case "agent": {
      const retrieveOutput = outputs.find(
        (o) => o?.documents && !o?.rerankScore
      );
      const rerankOutput = outputs.find((o) =>
        Array.isArray(o?.documents) &&
        (o?.documents as any)?.[0]?.rerankScore !== undefined
      );
      const judgeOutput = outputs.find((o) => o?.relevantDocuments);
      const queryOutput = outputs.find((o) => o?.query);
      const documents =
        judgeOutput?.relevantDocuments ||
        rerankOutput?.documents ||
        retrieveOutput?.documents;
      return {
        query: queryOutput?.query || initialQuery,
        documents,
      };
    }

    case "eval-faithfulness": {
      const queryOutput = outputs.find((o) => o?.query);
      const generateOutput = outputs.find((o) => o?.response || o?.text);
      const docsOutput = outputs.find((o) => o?.documents);
      const answer =
        (generateOutput?.response as string) ||
        (generateOutput?.text as string) ||
        "";
      const docs = (docsOutput?.documents || []) as Array<{ content: string }>;
      return {
        query: queryOutput?.query || initialQuery,
        answer,
        contexts: docs.map((d) => d.content),
      };
    }

    case "eval-relevancy": {
      const queryOutput = outputs.find((o) => o?.query);
      const generateOutput = outputs.find((o) => o?.response || o?.text);
      const answer =
        (generateOutput?.response as string) ||
        (generateOutput?.text as string) ||
        "";
      return {
        query: queryOutput?.query || initialQuery,
        answer,
      };
    }

    case "eval-context-precision": {
      const queryOutput = outputs.find((o) => o?.query);
      const docsOutput = outputs.find((o) => o?.documents);
      return {
        query: queryOutput?.query || initialQuery,
        documents: docsOutput?.documents || [],
      };
    }

    default:
      return { query: initialQuery };
  }
}

/**
 * Groups nodes by dependency level for parallel execution detection.
 * Nodes at the same level with no inter-dependencies can run in parallel.
 */
function groupByLevel(
  executionOrder: string[],
  depsMap: Map<string, string[]>
): string[][] {
  const levels = new Map<string, number>();

  for (const nodeId of executionOrder) {
    const deps = depsMap.get(nodeId) || [];
    const maxDepLevel =
      deps.length > 0
        ? Math.max(...deps.map((d) => levels.get(d) ?? 0))
        : -1;
    levels.set(nodeId, maxDepLevel + 1);
  }

  const groups = new Map<number, string[]>();
  for (const nodeId of executionOrder) {
    const level = levels.get(nodeId)!;
    const group = groups.get(level) || [];
    group.push(nodeId);
    groups.set(level, group);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([, nodes]) => nodes);
}

/**
 * Creates a Mastra vNext step for a canvas node.
 * Each step uses getStepResult() to pull upstream data and maps it
 * to the format expected by the underlying step factory.
 */
function createNodeStep(
  nodeId: string,
  nodeType: NodeType,
  nodeConfig: Record<string, unknown>,
  upstreamNodeIds: string[]
) {
  const factory = STEP_FACTORIES[nodeType];
  const baseStep = factory(nodeConfig);

  return createStep({
    id: nodeId,
    inputSchema: z.record(z.string(), z.unknown()),
    outputSchema: z.record(z.string(), z.unknown()),
    execute: async (params: any) => {
      const { getStepResult, getInitData } = params;
      const initData = getInitData() as { query: string };
      const initialQuery = initData?.query || "";

      // Gather upstream outputs
      const upstreamOutputs = new Map<string, Record<string, unknown>>();
      for (const upId of upstreamNodeIds) {
        try {
          const result = getStepResult(upId);
          if (result) upstreamOutputs.set(upId, result as Record<string, unknown>);
        } catch {
          // Step result not available (may not have run yet)
        }
      }

      // Map upstream data to what this step expects
      const mappedInput = mapUpstreamOutputs(
        nodeType,
        upstreamOutputs,
        initialQuery
      );

      // Execute the underlying step logic with mapped input
      const result = await (baseStep as any).execute({
        ...params,
        inputData: mappedInput,
      });

      return result;
    },
  });
}

/**
 * Compiles a canvas graph into a Mastra vNext workflow.
 * Uses .then() for sequential steps and .parallel() for independent groups.
 */
export function compileToWorkflow(graph: CanvasGraph): CompilationResult {
  const { nodes, edges } = graph;

  // 1. Validate the graph (CRAG loops are allowed)
  const validation = validateCanvas(nodes, edges);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors.map((e) => e.message),
      warnings: validation.warnings.map((w) => w.message),
    };
  }

  // 2. Filter out CRAG back-edges for topological sort
  const forwardEdges = edges.filter((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    const targetNode = nodes.find((n) => n.id === e.target);
    return !(sourceNode?.type === "judge" && targetNode?.type === "retrieve");
  });

  // 3. Topological sort on forward edges only
  const graphNodes: GraphNode[] = nodes.map((n) => ({
    id: n.id,
    type: n.type,
    dependencies: forwardEdges
      .filter((e) => e.target === n.id)
      .map((e) => e.source),
  }));

  const graphEdges: GraphEdge[] = forwardEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  let executionOrder: string[];
  try {
    executionOrder = topologicalSort(graphNodes, graphEdges);
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Failed to determine execution order",
      ],
      warnings: validation.warnings.map((w) => w.message),
    };
  }

  // 4. Build dependency map (forward edges only)
  const depsMap = new Map<string, string[]>();
  for (const edge of forwardEdges) {
    const deps = depsMap.get(edge.target) || [];
    deps.push(edge.source);
    depsMap.set(edge.target, deps);
  }

  // 5. Group nodes by execution level
  const levels = groupByLevel(executionOrder, depsMap);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // 6. Create Mastra steps for each node
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stepsByNodeId = new Map<string, any>();
  for (const nodeId of executionOrder) {
    const node = nodeMap.get(nodeId)!;
    const upstreamIds = depsMap.get(nodeId) || [];
    const step = createNodeStep(
      nodeId,
      node.type as NodeType,
      node.data.config || {},
      upstreamIds
    );
    stepsByNodeId.set(nodeId, step);
  }

  // 7. Build the workflow chain
  try {
    let wf: any = createWorkflow({
      id: "canvas-workflow",
      inputSchema: z.object({ query: z.string() }),
      outputSchema: z.record(z.string(), z.unknown()),
    });

    for (const level of levels) {
      if (level.length === 1) {
        // Sequential: single step at this level
        const step = stepsByNodeId.get(level[0]!);
        wf = wf.then(step);
      } else {
        // Parallel: multiple independent steps at this level
        const parallelSteps = level.map((id) => stepsByNodeId.get(id)!);
        wf = wf.parallel(parallelSteps);
      }
    }

    wf = wf.commit();

    return {
      success: true,
      workflow: wf,
      executionOrder,
      warnings: validation.warnings.map((w) => w.message),
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Workflow compilation failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
      warnings: validation.warnings.map((w) => w.message),
    };
  }
}

/**
 * Legacy: compiles graph using the old Mastra Workflow class.
 * @deprecated Use compileToWorkflow() instead.
 */
export const compileGraph = compileToWorkflow;

/**
 * Creates a simple execution plan from a canvas graph.
 * Used by the Wire Tap for step ordering display.
 */
export const createExecutionPlan = (graph: CanvasGraph): ExecutionPlan => {
  const { nodes, edges } = graph;

  const validation = validateCanvas(nodes, edges);
  if (!validation.valid) {
    throw new Error(
      `Invalid canvas: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  // Filter CRAG back-edges for topo sort
  const forwardEdges = edges.filter((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    const targetNode = nodes.find((n) => n.id === e.target);
    return !(sourceNode?.type === "judge" && targetNode?.type === "retrieve");
  });

  const graphNodes: GraphNode[] = nodes.map((n) => ({
    id: n.id,
    type: n.type,
    dependencies: forwardEdges
      .filter((e) => e.target === n.id)
      .map((e) => e.source),
  }));

  const graphEdges: GraphEdge[] = forwardEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  const executionOrder = topologicalSort(graphNodes, graphEdges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const inputMapping = new Map<string, string[]>();
  for (const edge of forwardEdges) {
    const inputs = inputMapping.get(edge.target) || [];
    inputs.push(edge.source);
    inputMapping.set(edge.target, inputs);
  }

  const steps: ExecutionStep[] = executionOrder.map((nodeId) => {
    const node = nodeMap.get(nodeId)!;
    return {
      nodeId: node.id,
      nodeType: node.type as NodeType,
      nodeLabel: node.data.label,
      config: node.data.config || {},
      inputs: inputMapping.get(nodeId) || [],
    };
  });

  return { steps, inputMapping };
};

/**
 * Gets the entry point (query node) of a canvas
 */
export const getEntryPoint = (graph: CanvasGraph): CanvasNode | undefined => {
  return graph.nodes.find((n) => n.type === "query");
};

/**
 * Gets the terminal nodes (generate/agent) of a canvas
 */
export const getTerminalNodes = (graph: CanvasGraph): CanvasNode[] => {
  return graph.nodes.filter(
    (n) => n.type === "generate" || n.type === "agent"
  );
};
