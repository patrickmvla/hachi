"use client";

import { useCallback } from "react";
import { useReactFlow, getOutgoers, type Connection, type Node, type Edge, type IsValidConnection } from "@xyflow/react";
import type { HachiNode, HachiEdge } from "@/stores/canvas-store";
import { VALID_CONNECTIONS, resolveNodeType } from "@hachi/schemas/nodes";

/**
 * Check if a connection would create a cycle in the graph
 */
function wouldCreateCycle(
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean {
  const target = nodes.find((node) => node.id === connection.target);
  if (!target) return false;

  // Can't connect to self
  if (target.id === connection.source) return true;

  // Check if target can reach source through existing edges
  const visited = new Set<string>();

  const hasCycle = (node: Node): boolean => {
    if (visited.has(node.id)) return false;
    visited.add(node.id);

    const outgoers = getOutgoers(node, nodes, edges);
    for (const outgoer of outgoers) {
      if (outgoer.id === connection.source) return true;
      if (hasCycle(outgoer)) return true;
    }
    return false;
  };

  return hasCycle(target);
}

/**
 * Check if connection is valid based on unified port type compatibility.
 * Translates frontend node types to backend types using resolveNodeType.
 */
function isTypeCompatible(
  connection: Connection,
  nodes: Node[]
): boolean {
  const source = nodes.find((n) => n.id === connection.source);
  const target = nodes.find((n) => n.id === connection.target);

  if (!source || !target) return false;

  const sourceType = resolveNodeType(source.type || "base");
  const targetType = resolveNodeType(target.type || "base");

  const allowedTargets = VALID_CONNECTIONS[sourceType];
  if (!allowedTargets) return true; // No rules defined, allow

  return allowedTargets.includes(targetType);
}

/**
 * Check if handle already has maximum connections
 */
function hasMaxConnections(
  connection: Connection,
  edges: Edge[],
  maxConnections: number = Infinity
): boolean {
  const targetConnections = edges.filter(
    (edge) =>
      edge.target === connection.target &&
      edge.targetHandle === connection.targetHandle
  );
  return targetConnections.length >= maxConnections;
}

interface UseConnectionValidationOptions {
  preventCycles?: boolean;
  validateTypes?: boolean;
  maxConnectionsPerHandle?: number;
}

/**
 * Hook for connection validation
 */
export const useConnectionValidation = (
  options: UseConnectionValidationOptions = {}
) => {
  const {
    preventCycles = true,
    validateTypes = true,
    maxConnectionsPerHandle = Infinity,
  } = options;

  const { getNodes, getEdges } = useReactFlow<HachiNode, HachiEdge>();

  const isValidConnection: IsValidConnection<HachiEdge> = useCallback(
    (connection) => {
      // Handle both Connection and Edge types
      const conn: Connection = {
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };

      const nodes = getNodes();
      const edges = getEdges();

      // Check for cycles
      if (preventCycles && wouldCreateCycle(conn, nodes, edges)) {
        return false;
      }

      // Check type compatibility
      if (validateTypes && !isTypeCompatible(conn, nodes)) {
        return false;
      }

      // Check max connections
      if (hasMaxConnections(conn, edges, maxConnectionsPerHandle)) {
        return false;
      }

      return true;
    },
    [getNodes, getEdges, preventCycles, validateTypes, maxConnectionsPerHandle]
  );

  return { isValidConnection };
};

/**
 * Standalone function to check if adding a connection would create a cycle
 */
export const checkForCycle = wouldCreateCycle;

/**
 * Standalone function to check type compatibility
 */
export const checkTypeCompatibility = isTypeCompatible;
