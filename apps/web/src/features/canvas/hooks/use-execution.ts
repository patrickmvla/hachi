"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { handleSSEEvent } from "./event-dispatcher";

/**
 * Real execution hook — streams SSE from the API and updates canvas/log stores.
 * Replaces useMockExecution for production use.
 */
export function useExecution(canvasId: string) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeWorkflow = useCallback(
    async (query: string) => {
      const canvasStore = useCanvasStore.getState();
      const logStore = useExecutionLogStore.getState();

      // Reset state
      canvasStore.clearAllNodeStatuses();
      logStore.clear();
      logStore.setTestQuery(query);
      canvasStore.setIsRunning(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch("/api/runs/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canvasId,
            input: { query },
          }),
          signal: abortController.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Execution failed: ${response.status} ${response.statusText}`
          );
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // Parse SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const jsonStr = line.slice(5).trim();
              if (!jsonStr) continue;

              try {
                const event = JSON.parse(jsonStr);
                handleSSEEvent(event);
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // User cancelled
        } else {
          console.error("Execution error:", error);
        }
      } finally {
        canvasStore.setIsRunning(false);
        abortControllerRef.current = null;
      }
    },
    [canvasId]
  );

  const stopExecution = useCallback(() => {
    abortControllerRef.current?.abort();
    useCanvasStore.getState().setIsRunning(false);
    useExecutionLogStore.getState().setCurrentNodeId(null);
  }, []);

  return { executeWorkflow, stopExecution };
}
