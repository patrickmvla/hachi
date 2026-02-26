import { useCallback } from "react";
import { type Connection, type Edge } from "@xyflow/react";
import { usePlaygroundStore } from "../store/playground-store";

export function usePlaygroundConnection() {
  const onConnect = usePlaygroundStore((s) => s.onConnect);
  const edges = usePlaygroundStore((s) => s.edges);
  const nodes = usePlaygroundStore((s) => s.nodes);

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;

      // Check for duplicate edge
      const duplicate = edges.some(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (duplicate) return false;

      // Check if adding this edge would create a cycle (DFS)
      const adjList = new Map<string, string[]>();
      for (const node of nodes) {
        adjList.set(node.id, []);
      }
      for (const edge of edges) {
        adjList.get(edge.source)?.push(edge.target);
      }
      // Add the proposed edge
      adjList.get(connection.source)?.push(connection.target);

      const visited = new Set<string>();
      const inStack = new Set<string>();

      function hasCycleDFS(nodeId: string): boolean {
        visited.add(nodeId);
        inStack.add(nodeId);
        for (const neighbor of adjList.get(nodeId) || []) {
          if (!visited.has(neighbor)) {
            if (hasCycleDFS(neighbor)) return true;
          } else if (inStack.has(neighbor)) {
            return true;
          }
        }
        inStack.delete(nodeId);
        return false;
      }

      for (const node of nodes) {
        if (!visited.has(node.id)) {
          if (hasCycleDFS(node.id)) return false;
        }
      }

      return true;
    },
    [edges, nodes]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (isValidConnection(connection)) {
        onConnect(connection);
      }
    },
    [isValidConnection, onConnect]
  );

  return { isValidConnection, onConnect: handleConnect };
}
