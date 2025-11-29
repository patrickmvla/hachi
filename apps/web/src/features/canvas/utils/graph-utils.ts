"use client";

import {
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  getNodesBounds,
  getViewportForBounds,
  addEdge,
  reconnectEdge,
  isEdge,
  isNode,
  type Node,
  type Edge,
  type Connection,
  type Rect,
  type Viewport,
} from "@xyflow/react";

/**
 * Graph traversal utilities
 */

/**
 * Get all nodes that have edges pointing TO a given node
 */
export const getNodeIncomers = <N extends Node = Node, E extends Edge = Edge>(
  nodeId: string,
  nodes: N[],
  edges: E[]
): N[] => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return [];
  return getIncomers(node, nodes, edges);
};

/**
 * Get all nodes that a given node has edges pointing TO
 */
export const getNodeOutgoers = <N extends Node = Node, E extends Edge = Edge>(
  nodeId: string,
  nodes: N[],
  edges: E[]
): N[] => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return [];
  return getOutgoers(node, nodes, edges);
};

/**
 * Get all edges connected to a set of nodes
 */
export const getEdgesForNodes = <N extends Node = Node, E extends Edge = Edge>(
  nodeIds: string[],
  nodes: N[],
  edges: E[]
): E[] => {
  const selectedNodes = nodes.filter((n) => nodeIds.includes(n.id));
  return getConnectedEdges(selectedNodes, edges);
};

/**
 * Get all ancestor nodes (recursive incomers) up to a depth limit
 */
export const getAncestors = <N extends Node = Node, E extends Edge = Edge>(
  nodeId: string,
  nodes: N[],
  edges: E[],
  maxDepth = 10
): N[] => {
  const visited = new Set<string>();
  const result: N[] = [];

  const traverse = (currentId: string, depth: number) => {
    if (depth > maxDepth || visited.has(currentId)) return;
    visited.add(currentId);

    const incomers = getNodeIncomers(currentId, nodes, edges);
    for (const incomer of incomers) {
      if (!visited.has(incomer.id)) {
        result.push(incomer);
        traverse(incomer.id, depth + 1);
      }
    }
  };

  traverse(nodeId, 0);
  return result;
};

/**
 * Get all descendant nodes (recursive outgoers) up to a depth limit
 */
export const getDescendants = <N extends Node = Node, E extends Edge = Edge>(
  nodeId: string,
  nodes: N[],
  edges: E[],
  maxDepth = 10
): N[] => {
  const visited = new Set<string>();
  const result: N[] = [];

  const traverse = (currentId: string, depth: number) => {
    if (depth > maxDepth || visited.has(currentId)) return;
    visited.add(currentId);

    const outgoers = getNodeOutgoers(currentId, nodes, edges);
    for (const outgoer of outgoers) {
      if (!visited.has(outgoer.id)) {
        result.push(outgoer);
        traverse(outgoer.id, depth + 1);
      }
    }
  };

  traverse(nodeId, 0);
  return result;
};

/**
 * Check if node A can reach node B through edges
 */
export const canReach = <N extends Node = Node, E extends Edge = Edge>(
  sourceId: string,
  targetId: string,
  nodes: N[],
  edges: E[]
): boolean => {
  const descendants = getDescendants(sourceId, nodes, edges);
  return descendants.some((n) => n.id === targetId);
};

/**
 * Find all paths from source to target
 */
export const findPaths = <N extends Node = Node, E extends Edge = Edge>(
  sourceId: string,
  targetId: string,
  nodes: N[],
  edges: E[],
  maxPaths = 10
): string[][] => {
  const paths: string[][] = [];

  const traverse = (currentId: string, path: string[]) => {
    if (paths.length >= maxPaths) return;
    if (currentId === targetId) {
      paths.push([...path, currentId]);
      return;
    }

    const outgoers = getNodeOutgoers(currentId, nodes, edges);
    for (const outgoer of outgoers) {
      if (!path.includes(outgoer.id)) {
        traverse(outgoer.id, [...path, currentId]);
      }
    }
  };

  traverse(sourceId, []);
  return paths;
};

/**
 * Edge utilities
 */

/**
 * Safely add an edge, preventing duplicates
 */
export const safeAddEdge = <E extends Edge = Edge>(
  connection: Edge | Connection,
  edges: E[]
): E[] => {
  return addEdge(connection, edges) as E[];
};

/**
 * Reconnect an existing edge to a new source/target
 */
export const safeReconnectEdge = <E extends Edge = Edge>(
  oldEdge: E,
  newConnection: Connection,
  edges: E[]
): E[] => {
  return reconnectEdge(oldEdge, newConnection, edges) as E[];
};

/**
 * Remove edges by their IDs
 */
export const removeEdges = <E extends Edge = Edge>(
  edgeIds: string[],
  edges: E[]
): E[] => {
  return edges.filter((e) => !edgeIds.includes(e.id));
};

/**
 * Remove all edges connected to specific nodes
 */
export const removeEdgesForNodes = <N extends Node = Node, E extends Edge = Edge>(
  nodeIds: string[],
  nodes: N[],
  edges: E[]
): E[] => {
  const connectedEdges = getEdgesForNodes(nodeIds, nodes, edges);
  const connectedEdgeIds = new Set(connectedEdges.map((e) => e.id));
  return edges.filter((e) => !connectedEdgeIds.has(e.id));
};

/**
 * Bounds and viewport utilities
 */

/**
 * Get the bounding rectangle for a set of nodes
 */
export const getBoundsForNodes = <N extends Node = Node>(
  nodeIds: string[],
  nodes: N[]
): Rect | null => {
  const selectedNodes = nodes.filter((n) => nodeIds.includes(n.id));
  if (selectedNodes.length === 0) return null;
  return getNodesBounds(selectedNodes);
};

/**
 * Calculate viewport to fit specific nodes with padding
 */
export const getViewportForNodes = <N extends Node = Node>(
  nodeIds: string[],
  nodes: N[],
  containerWidth: number,
  containerHeight: number,
  options: { minZoom?: number; maxZoom?: number; padding?: number } = {}
): Viewport | null => {
  const bounds = getBoundsForNodes(nodeIds, nodes);
  if (!bounds) return null;

  const { minZoom = 0.1, maxZoom = 2, padding = 0.1 } = options;

  return getViewportForBounds(
    bounds,
    containerWidth,
    containerHeight,
    minZoom,
    maxZoom,
    padding
  );
};

/**
 * Type guards
 */

export { isEdge, isNode };

/**
 * Check if an item is a specific node type
 */
export const isNodeOfType = <N extends Node = Node>(
  item: unknown,
  type: string
): item is N => {
  return isNode(item) && item.type === type;
};

/**
 * Topological sort utilities
 */

/**
 * Get execution order for nodes (topological sort)
 * Returns nodes in order they should be executed (sources first, sinks last)
 */
export const getExecutionOrder = <N extends Node = Node, E extends Edge = Edge>(
  nodes: N[],
  edges: E[]
): N[] => {
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjList.set(node.id, []);
  }

  // Build adjacency list and count in-degrees
  for (const edge of edges) {
    const neighbors = adjList.get(edge.source);
    if (neighbors) {
      neighbors.push(edge.target);
    }
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Find all sources (nodes with no incoming edges)
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // Process nodes in topological order
  const result: N[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      result.push(node);
    }

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
};

/**
 * Detect cycles in the graph
 */
export const hasCycle = <N extends Node = Node, E extends Edge = Edge>(
  nodes: N[],
  edges: E[]
): boolean => {
  const executionOrder = getExecutionOrder(nodes, edges);
  return executionOrder.length !== nodes.length;
};

/**
 * Get root nodes (nodes with no incoming edges)
 */
export const getRootNodes = <N extends Node = Node, E extends Edge = Edge>(
  nodes: N[],
  edges: E[]
): N[] => {
  const hasIncoming = new Set(edges.map((e) => e.target));
  return nodes.filter((n) => !hasIncoming.has(n.id));
};

/**
 * Get leaf nodes (nodes with no outgoing edges)
 */
export const getLeafNodes = <N extends Node = Node, E extends Edge = Edge>(
  nodes: N[],
  edges: E[]
): N[] => {
  const hasOutgoing = new Set(edges.map((e) => e.source));
  return nodes.filter((n) => !hasOutgoing.has(n.id));
};
