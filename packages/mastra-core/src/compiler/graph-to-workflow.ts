import { Workflow, type Step } from "@mastra/core";
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
} from "../steps";
import { validateCanvas, type CanvasNode, type CanvasEdge } from "./validate";
import { topologicalSort, type GraphNode, type GraphEdge } from "./topological-sort";
import type { NodeType } from "@hachi/schemas/nodes";

/**
 * Graph to Workflow Compiler
 * Converts canvas JSON (React Flow format) to executable Mastra workflow
 */

export interface CanvasGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface CompilationResult {
  success: boolean;
  workflow?: Workflow<any, any>;
  executionOrder?: string[];
  errors?: string[];
  warnings?: string[];
}

/**
 * Step factory registry - maps node types to step creators
 */
const STEP_FACTORIES: Record<NodeType, (config?: any) => Step<any, any, any>> = {
  query: createQueryStep,
  embed: createEmbedStep,
  retrieve: createRetrieveStep,
  generate: createGenerateStep,
  hyde: createHyDEStep,
  rerank: createRerankStep,
  judge: createJudgeStep,
  agent: createAgentStep,
};

/**
 * Compiles a canvas graph into an executable Mastra workflow
 */
export const compileGraph = (graph: CanvasGraph): CompilationResult => {
  const { nodes, edges } = graph;

  // 1. Validate the graph
  const validation = validateCanvas(nodes, edges);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors.map((e) => e.message),
      warnings: validation.warnings.map((w) => w.message),
    };
  }

  // 2. Determine execution order via topological sort
  const graphNodes: GraphNode[] = nodes.map((n) => ({
    id: n.id,
    type: n.type,
    dependencies: edges.filter((e) => e.target === n.id).map((e) => e.source),
  }));

  const graphEdges: GraphEdge[] = edges.map((e) => ({
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
      errors: [error instanceof Error ? error.message : "Failed to determine execution order"],
      warnings: validation.warnings.map((w) => w.message),
    };
  }

  // 3. Create steps for each node
  const steps: Step<any, any, any>[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const nodeId of executionOrder) {
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const stepFactory = STEP_FACTORIES[node.type as NodeType];
    if (!stepFactory) {
      return {
        success: false,
        errors: [`Unknown node type: ${node.type}`],
        warnings: validation.warnings.map((w) => w.message),
      };
    }

    // Create step with node's configuration
    const step = stepFactory(node.data.config);
    steps.push(step);
  }

  // 4. Build the workflow
  // Note: Mastra workflows are built differently - this is a simplified version
  // In practice, you'd need to wire up the steps based on the edges
  const workflow = new Workflow({
    name: "canvas-workflow",
    triggerSchema: z.object({
      query: z.string(),
    }),
  });

  return {
    success: true,
    workflow,
    executionOrder,
    warnings: validation.warnings.map((w) => w.message),
  };
};

/**
 * Creates a simple execution plan from a canvas graph
 * This is a more practical approach for running the pipeline
 */
export interface ExecutionPlan {
  steps: ExecutionStep[];
  inputMapping: Map<string, string[]>; // nodeId -> [sourceNodeIds]
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  config: Record<string, unknown>;
  inputs: string[]; // Node IDs this step depends on
}

export const createExecutionPlan = (graph: CanvasGraph): ExecutionPlan => {
  const { nodes, edges } = graph;

  // Validate first
  const validation = validateCanvas(nodes, edges);
  if (!validation.valid) {
    throw new Error(`Invalid canvas: ${validation.errors.map((e) => e.message).join(", ")}`);
  }

  // Build execution order
  const graphNodes: GraphNode[] = nodes.map((n) => ({
    id: n.id,
    type: n.type,
    dependencies: edges.filter((e) => e.target === n.id).map((e) => e.source),
  }));

  const graphEdges: GraphEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  const executionOrder = topologicalSort(graphNodes, graphEdges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Build input mapping
  const inputMapping = new Map<string, string[]>();
  for (const edge of edges) {
    const inputs = inputMapping.get(edge.target) || [];
    inputs.push(edge.source);
    inputMapping.set(edge.target, inputs);
  }

  // Create execution steps
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

  return {
    steps,
    inputMapping,
  };
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
  return graph.nodes.filter((n) => n.type === "generate" || n.type === "agent");
};
