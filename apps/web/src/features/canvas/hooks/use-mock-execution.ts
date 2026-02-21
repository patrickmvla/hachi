"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { getMockOutput } from "../mock/mock-data";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useMockExecution() {
  const abortRef = useRef(false);

  const executeWorkflow = useCallback(async (query: string) => {
    const canvasStore = useCanvasStore.getState();
    const logStore = useExecutionLogStore.getState();

    abortRef.current = false;

    // Reset state
    canvasStore.clearAllNodeStatuses();
    logStore.clear();
    logStore.setTestQuery(query);
    canvasStore.setIsRunning(true);

    // Get topological execution order
    const executionOrder = canvasStore.getExecutionOrder();

    if (executionOrder.length === 0) {
      canvasStore.setIsRunning(false);
      return;
    }

    for (const node of executionOrder) {
      if (abortRef.current) break;

      const nodeType = node.type || node.data.type || "unknown";
      const mockData = getMockOutput(nodeType, query);
      const entryId = crypto.randomUUID();

      // Set node as loading
      canvasStore.setNodeStatus(node.id, "loading");
      logStore.setCurrentNodeId(node.id);

      // Add running entry to log
      logStore.addEntry({
        id: entryId,
        nodeId: node.id,
        nodeName: node.data.label,
        nodeType,
        status: "running",
        stepName: mockData.stepName,
        latencyMs: mockData.latencyMs,
        output: null,
        logMessages: [mockData.logMessages[0] || "Processing..."],
        timestamp: Date.now(),
      });

      // Simulate processing time
      await sleep(mockData.latencyMs);

      if (abortRef.current) {
        canvasStore.setNodeStatus(node.id, "initial");
        logStore.updateEntry(entryId, { status: "error", logMessages: ["Aborted"] });
        break;
      }

      // Mark node as success
      canvasStore.setNodeStatus(node.id, "success");
      logStore.updateEntry(entryId, {
        status: "success",
        output: mockData.output,
        logMessages: mockData.logMessages,
      });

      // Animate incoming edges
      const { edges } = useCanvasStore.getState();
      for (const edge of edges) {
        if (edge.target === node.id) {
          canvasStore.setEdgeAnimated(edge.id, true);
        }
      }

      logStore.setCurrentNodeId(null);
    }

    canvasStore.setIsRunning(false);
  }, []);

  const stopExecution = useCallback(() => {
    abortRef.current = true;
    useCanvasStore.getState().setIsRunning(false);
    useExecutionLogStore.getState().setCurrentNodeId(null);
  }, []);

  return { executeWorkflow, stopExecution };
}
