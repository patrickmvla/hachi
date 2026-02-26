import { useCallback, useRef } from "react";
import { getMockOutput } from "@/features/canvas/mock/mock-data";
import { usePlaygroundStore, type LogEntry } from "../store/playground-store";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePlaygroundExecution() {
  const store = usePlaygroundStore;
  const abortRef = useRef(false);

  const executeWorkflow = useCallback(
    async (query: string) => {
      const state = store.getState();
      if (state.isRunning || state.nodes.length === 0) return;

      abortRef.current = false;
      state.setIsRunning(true);
      state.clearLog();
      state.clearAllNodeStatuses();
      state.clearAllEdgeAnimations();

      const executionOrder = state.getExecutionOrder();
      if (executionOrder.length === 0) {
        state.setIsRunning(false);
        return;
      }

      for (const node of executionOrder) {
        if (abortRef.current) break;

        const nodeType = node.data.type;
        state.setCurrentNodeId(node.id);
        state.setNodeStatus(node.id, "loading");

        // Create log entry
        const logEntry: LogEntry = {
          id: crypto.randomUUID(),
          nodeId: node.id,
          nodeType,
          stepName: node.data.label,
          status: "loading",
          startedAt: Date.now(),
        };
        state.addLogEntry(logEntry);

        // Animate incoming edges
        const { edges } = store.getState();
        const incomingEdges = edges.filter((e) => e.target === node.id);
        for (const edge of incomingEdges) {
          state.setEdgeAnimated(edge.id, true);
        }

        // Get mock output and simulate latency
        const mockOutput = getMockOutput(nodeType, query);
        await sleep(Math.min(mockOutput.latencyMs, 800));

        if (abortRef.current) {
          state.setNodeStatus(node.id, "initial");
          state.updateLogEntry(logEntry.id, { status: "initial" });
          break;
        }

        // Complete this node
        state.setNodeStatus(node.id, "success");
        state.updateLogEntry(logEntry.id, {
          status: "success",
          completedAt: Date.now(),
          latencyMs: mockOutput.latencyMs,
          output: mockOutput.output,
          logMessages: mockOutput.logMessages,
        });

        // Stop edge animations for this node
        for (const edge of incomingEdges) {
          state.setEdgeAnimated(edge.id, false);
        }
      }

      state.setCurrentNodeId(null);
      state.setIsRunning(false);
    },
    [store]
  );

  const stopExecution = useCallback(() => {
    abortRef.current = true;
    store.getState().setIsRunning(false);
    store.getState().setCurrentNodeId(null);
  }, [store]);

  return { executeWorkflow, stopExecution };
}
