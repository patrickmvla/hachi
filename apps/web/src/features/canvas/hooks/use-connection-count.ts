"use client";

import { useMemo } from "react";
import { useNodeConnections } from "@xyflow/react";

interface ConnectionCounts {
  incoming: number;
  outgoing: number;
  total: number;
}

/**
 * Hook to get connection counts for a node
 * Must be used inside a custom node component
 */
export const useConnectionCount = (): ConnectionCounts => {
  const incomingConnections = useNodeConnections({
    handleType: "target",
  });

  const outgoingConnections = useNodeConnections({
    handleType: "source",
  });

  return useMemo(
    () => ({
      incoming: incomingConnections.length,
      outgoing: outgoingConnections.length,
      total: incomingConnections.length + outgoingConnections.length,
    }),
    [incomingConnections.length, outgoingConnections.length]
  );
};

/**
 * Hook to get incoming connections for a specific handle
 */
export const useIncomingConnections = (handleId?: string) => {
  return useNodeConnections({
    handleType: "target",
    handleId,
  });
};

/**
 * Hook to get outgoing connections for a specific handle
 */
export const useOutgoingConnections = (handleId?: string) => {
  return useNodeConnections({
    handleType: "source",
    handleId,
  });
};
