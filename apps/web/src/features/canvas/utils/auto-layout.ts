"use client";

import { Position, type Node, type Edge } from "@xyflow/react";

// Simple layout without external dependencies
// For production, consider using dagre, elkjs, or d3-hierarchy

export type LayoutDirection = "TB" | "BT" | "LR" | "RL";

interface LayoutOptions {
  direction?: LayoutDirection;
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
}

interface LayoutedElements<N extends Node = Node, E extends Edge = Edge> {
  nodes: N[];
  edges: E[];
}

/**
 * Get the position properties based on layout direction
 */
function getPositionProps(direction: LayoutDirection) {
  switch (direction) {
    case "TB":
      return { sourcePosition: Position.Bottom, targetPosition: Position.Top };
    case "BT":
      return { sourcePosition: Position.Top, targetPosition: Position.Bottom };
    case "LR":
      return { sourcePosition: Position.Right, targetPosition: Position.Left };
    case "RL":
      return { sourcePosition: Position.Left, targetPosition: Position.Right };
    default:
      return { sourcePosition: Position.Bottom, targetPosition: Position.Top };
  }
}

/**
 * Calculate node levels (depth from root nodes)
 */
function calculateLevels<N extends Node>(
  nodes: N[],
  edges: Edge[]
): Map<string, number> {
  const levels = new Map<string, number>();
  const inDegree = new Map<string, number>();
  const children = new Map<string, string[]>();

  // Initialize
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    children.set(node.id, []);
  });

  // Build graph
  edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    const childList = children.get(edge.source) || [];
    childList.push(edge.target);
    children.set(edge.source, childList);
  });

  // BFS to assign levels
  const queue: { id: string; level: number }[] = [];

  // Start with root nodes (no incoming edges)
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push({ id: node.id, level: 0 });
      levels.set(node.id, 0);
    }
  });

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    const nodeChildren = children.get(id) || [];

    nodeChildren.forEach((childId) => {
      const currentLevel = levels.get(childId);
      const newLevel = level + 1;

      // Take the maximum level if node has multiple parents
      if (currentLevel === undefined || newLevel > currentLevel) {
        levels.set(childId, newLevel);
      }

      // Only add to queue if not already processed at this or higher level
      if (currentLevel === undefined) {
        queue.push({ id: childId, level: newLevel });
      }
    });
  }

  return levels;
}

/**
 * Group nodes by their level
 */
function groupByLevel<N extends Node>(
  nodes: N[],
  levels: Map<string, number>
): Map<number, N[]> {
  const groups = new Map<number, N[]>();

  nodes.forEach((node) => {
    const level = levels.get(node.id) ?? 0;
    const group = groups.get(level) || [];
    group.push(node);
    groups.set(level, group);
  });

  return groups;
}

/**
 * Simple hierarchical layout algorithm
 * Arranges nodes in a tree-like structure based on their connections
 */
export function getLayoutedElements<N extends Node = Node, E extends Edge = Edge>(
  nodes: N[],
  edges: E[],
  options: LayoutOptions = {}
): LayoutedElements<N, E> {
  const {
    direction = "TB",
    nodeWidth = 200,
    nodeHeight = 80,
    horizontalSpacing = 50,
    verticalSpacing = 100,
  } = options;

  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const { sourcePosition, targetPosition } = getPositionProps(direction);
  const isHorizontal = direction === "LR" || direction === "RL";

  // Calculate levels
  const levels = calculateLevels(nodes, edges);
  const levelGroups = groupByLevel(nodes, levels);

  // Calculate positions
  const layoutedNodes = nodes.map((node) => {
    const level = levels.get(node.id) ?? 0;
    const levelNodes = levelGroups.get(level) || [];
    const indexInLevel = levelNodes.findIndex((n) => n.id === node.id);
    const levelWidth = levelNodes.length;

    let x: number, y: number;

    if (isHorizontal) {
      // Horizontal layout
      const mainAxis = level * (nodeWidth + verticalSpacing);
      const crossAxisStart = -(levelWidth - 1) * (nodeHeight + horizontalSpacing) / 2;
      const crossAxis = crossAxisStart + indexInLevel * (nodeHeight + horizontalSpacing);

      x = direction === "LR" ? mainAxis : -mainAxis;
      y = crossAxis;
    } else {
      // Vertical layout
      const mainAxis = level * (nodeHeight + verticalSpacing);
      const crossAxisStart = -(levelWidth - 1) * (nodeWidth + horizontalSpacing) / 2;
      const crossAxis = crossAxisStart + indexInLevel * (nodeWidth + horizontalSpacing);

      x = crossAxis;
      y = direction === "TB" ? mainAxis : -mainAxis;
    }

    return {
      ...node,
      position: { x, y },
      sourcePosition,
      targetPosition,
    } as N;
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Center the layout around a specific point
 */
export function centerLayout<N extends Node = Node>(
  nodes: N[],
  centerX: number = 0,
  centerY: number = 0
): N[] {
  if (nodes.length === 0) return nodes;

  // Calculate current center
  const bounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.position.x),
      maxX: Math.max(acc.maxX, node.position.x),
      minY: Math.min(acc.minY, node.position.y),
      maxY: Math.max(acc.maxY, node.position.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );

  const currentCenterX = (bounds.minX + bounds.maxX) / 2;
  const currentCenterY = (bounds.minY + bounds.maxY) / 2;

  const offsetX = centerX - currentCenterX;
  const offsetY = centerY - currentCenterY;

  return nodes.map((node) => ({
    ...node,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
  }));
}

/**
 * Layout preset configurations
 */
export const layoutPresets = {
  topToBottom: { direction: "TB" as const, verticalSpacing: 100, horizontalSpacing: 50 },
  bottomToTop: { direction: "BT" as const, verticalSpacing: 100, horizontalSpacing: 50 },
  leftToRight: { direction: "LR" as const, verticalSpacing: 50, horizontalSpacing: 100 },
  rightToLeft: { direction: "RL" as const, verticalSpacing: 50, horizontalSpacing: 100 },
};
