import { z } from "zod";
import { NODE_TYPES, type NodeType } from "@hachi/schemas/nodes";

/**
 * Canvas Validation
 * Validates node configurations and connections before compilation
 */

// Define valid connection types between nodes
const VALID_CONNECTIONS: Record<NodeType, NodeType[]> = {
  query: ["embed", "hyde", "generate", "agent"],
  hyde: ["embed"],
  embed: ["retrieve"],
  retrieve: ["rerank", "judge", "generate", "agent"],
  rerank: ["judge", "generate", "agent"],
  judge: ["generate", "agent", "retrieve"], // Can route back to retrieve or forward
  generate: [], // Terminal node
  agent: [], // Terminal node (can loop internally but not to other nodes)
};

// Define required upstream connections
const REQUIRED_INPUTS: Partial<Record<NodeType, NodeType[]>> = {
  retrieve: ["embed"], // Retrieve needs embeddings
  rerank: ["retrieve"], // Rerank needs retrieved documents
  judge: ["retrieve"], // Judge needs retrieved documents
  generate: [], // Generate can work with just query
};

export interface CanvasNode {
  id: string;
  type: NodeType;
  data: {
    label: string;
    type: string;
    config?: Record<string, unknown>;
  };
  position: { x: number; y: number };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: "error";
  nodeId?: string;
  edgeId?: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  type: "warning";
  nodeId?: string;
  edgeId?: string;
  message: string;
  code: string;
}

/**
 * Validates a canvas graph for execution
 */
export const validateCanvas = (
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Create lookup maps
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const incomingEdges = new Map<string, CanvasEdge[]>();
  const outgoingEdges = new Map<string, CanvasEdge[]>();

  for (const edge of edges) {
    const incoming = incomingEdges.get(edge.target) || [];
    incoming.push(edge);
    incomingEdges.set(edge.target, incoming);

    const outgoing = outgoingEdges.get(edge.source) || [];
    outgoing.push(edge);
    outgoingEdges.set(edge.source, outgoing);
  }

  // 1. Check for at least one query node
  const queryNodes = nodes.filter((n) => n.type === "query");
  if (queryNodes.length === 0) {
    errors.push({
      type: "error",
      message: "Canvas must have at least one Query node as entry point",
      code: "NO_QUERY_NODE",
    });
  } else if (queryNodes.length > 1) {
    warnings.push({
      type: "warning",
      message: "Multiple Query nodes found - only the first will be used as entry point",
      code: "MULTIPLE_QUERY_NODES",
    });
  }

  // 2. Check for at least one terminal node (generate or agent)
  const terminalNodes = nodes.filter((n) => n.type === "generate" || n.type === "agent");
  if (terminalNodes.length === 0) {
    errors.push({
      type: "error",
      message: "Canvas must have at least one Generate or Agent node as output",
      code: "NO_TERMINAL_NODE",
    });
  }

  // 3. Validate each edge connection
  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode) {
      errors.push({
        type: "error",
        edgeId: edge.id,
        message: `Edge references non-existent source node: ${edge.source}`,
        code: "INVALID_SOURCE",
      });
      continue;
    }

    if (!targetNode) {
      errors.push({
        type: "error",
        edgeId: edge.id,
        message: `Edge references non-existent target node: ${edge.target}`,
        code: "INVALID_TARGET",
      });
      continue;
    }

    // Check if connection is valid
    const validTargets = VALID_CONNECTIONS[sourceNode.type as NodeType] || [];
    if (!validTargets.includes(targetNode.type as NodeType)) {
      errors.push({
        type: "error",
        edgeId: edge.id,
        message: `Invalid connection: ${sourceNode.type} cannot connect to ${targetNode.type}`,
        code: "INVALID_CONNECTION",
      });
    }
  }

  // 4. Check for disconnected nodes (except query nodes)
  for (const node of nodes) {
    if (node.type === "query") continue; // Query nodes don't need incoming edges

    const incoming = incomingEdges.get(node.id) || [];
    const outgoing = outgoingEdges.get(node.id) || [];

    if (incoming.length === 0) {
      warnings.push({
        type: "warning",
        nodeId: node.id,
        message: `Node "${node.data.label}" has no incoming connections`,
        code: "NO_INCOMING",
      });
    }

    if (outgoing.length === 0 && node.type !== "generate" && node.type !== "agent") {
      warnings.push({
        type: "warning",
        nodeId: node.id,
        message: `Node "${node.data.label}" has no outgoing connections`,
        code: "NO_OUTGOING",
      });
    }
  }

  // 5. Check for cycles (simple DFS-based cycle detection)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({
      type: "error",
      message: "Canvas contains a cycle - pipelines must be acyclic (DAG)",
      code: "CYCLE_DETECTED",
    });
  }

  // 6. Validate required upstream nodes
  for (const node of nodes) {
    const requiredUpstream = REQUIRED_INPUTS[node.type as NodeType];
    if (!requiredUpstream || requiredUpstream.length === 0) continue;

    const ancestorTypes = getAncestorTypes(node.id, nodes, edges, nodeMap);

    for (const required of requiredUpstream) {
      if (!ancestorTypes.includes(required)) {
        warnings.push({
          type: "warning",
          nodeId: node.id,
          message: `Node "${node.data.label}" (${node.type}) typically requires a ${required} node upstream`,
          code: "MISSING_UPSTREAM",
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Detects cycles in the graph using DFS
 */
const detectCycle = (nodes: CanvasNode[], edges: CanvasEdge[]): boolean => {
  const adjacencyList = new Map<string, string[]>();

  for (const node of nodes) {
    adjacencyList.set(node.id, []);
  }

  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
};

/**
 * Gets all ancestor node types for a given node
 */
const getAncestorTypes = (
  nodeId: string,
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  nodeMap: Map<string, CanvasNode>
): NodeType[] => {
  const reverseAdjacencyList = new Map<string, string[]>();

  for (const node of nodes) {
    reverseAdjacencyList.set(node.id, []);
  }

  for (const edge of edges) {
    const parents = reverseAdjacencyList.get(edge.target) || [];
    parents.push(edge.source);
    reverseAdjacencyList.set(edge.target, parents);
  }

  const ancestorTypes = new Set<NodeType>();
  const visited = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const parents = reverseAdjacencyList.get(current) || [];

    for (const parent of parents) {
      if (!visited.has(parent)) {
        visited.add(parent);
        const parentNode = nodeMap.get(parent);
        if (parentNode) {
          ancestorTypes.add(parentNode.type as NodeType);
        }
        queue.push(parent);
      }
    }
  }

  return Array.from(ancestorTypes);
};
