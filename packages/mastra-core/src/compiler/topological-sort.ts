/**
 * Topological Sort
 * Determines execution order for a DAG of nodes
 */

export interface GraphNode {
  id: string;
  type: string;
  dependencies: string[]; // IDs of nodes this node depends on
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

/**
 * Performs topological sort on a graph to determine execution order
 * Uses Kahn's algorithm for stable, predictable ordering
 */
export const topologicalSort = (
  nodes: GraphNode[],
  edges: GraphEdge[]
): string[] => {
  // Build adjacency list and in-degree map
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize
  for (const node of nodes) {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  // Build graph from edges
  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);

    const currentDegree = inDegree.get(edge.target) || 0;
    inDegree.set(edge.target, currentDegree + 1);
  }

  // Find all nodes with no incoming edges (sources)
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // Process nodes in topological order
  const result: string[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      const degree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, degree);
      if (degree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Check for cycles
  if (result.length !== nodes.length) {
    throw new Error("Graph contains a cycle - cannot determine execution order");
  }

  return result;
};

/**
 * Validates that a graph is a valid DAG (Directed Acyclic Graph)
 */
export const validateDAG = (
  nodes: GraphNode[],
  edges: GraphEdge[]
): { valid: boolean; error?: string } => {
  try {
    topologicalSort(nodes, edges);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid graph structure",
    };
  }
};

/**
 * Finds all paths from source to target in the graph
 */
export const findAllPaths = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId: string,
  targetId: string
): string[][] => {
  const adjacencyList = new Map<string, string[]>();

  for (const node of nodes) {
    adjacencyList.set(node.id, []);
  }

  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  }

  const paths: string[][] = [];
  const visited = new Set<string>();

  const dfs = (currentId: string, path: string[]) => {
    if (currentId === targetId) {
      paths.push([...path]);
      return;
    }

    visited.add(currentId);
    const neighbors = adjacencyList.get(currentId) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        path.push(neighbor);
        dfs(neighbor, path);
        path.pop();
      }
    }

    visited.delete(currentId);
  };

  dfs(sourceId, [sourceId]);
  return paths;
};

/**
 * Gets the ancestors (all nodes that lead to this node) of a given node
 */
export const getAncestors = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  nodeId: string
): string[] => {
  const reverseAdjacencyList = new Map<string, string[]>();

  for (const node of nodes) {
    reverseAdjacencyList.set(node.id, []);
  }

  for (const edge of edges) {
    const parents = reverseAdjacencyList.get(edge.target) || [];
    parents.push(edge.source);
    reverseAdjacencyList.set(edge.target, parents);
  }

  const ancestors = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const parents = reverseAdjacencyList.get(current) || [];

    for (const parent of parents) {
      if (!ancestors.has(parent)) {
        ancestors.add(parent);
        queue.push(parent);
      }
    }
  }

  return Array.from(ancestors);
};
