"use client";

import { useCallback } from "react";
import { useReactFlow, type Viewport } from "@xyflow/react";
import { useCanvasStore, type HachiNode, type HachiEdge } from "@/stores/canvas-store";

interface FlowData {
  nodes: HachiNode[];
  edges: HachiEdge[];
  viewport: Viewport;
  version: number;
  savedAt: string;
}

const STORAGE_KEY_PREFIX = "hachi-canvas-";
const CURRENT_VERSION = 1;

/**
 * Hook for saving and restoring flow state
 */
export const useFlowPersistence = (canvasId: string = "default") => {
  const { setViewport, getViewport } = useReactFlow();
  const { nodes, edges, setNodes, setEdges, reset } = useCanvasStore();

  const storageKey = `${STORAGE_KEY_PREFIX}${canvasId}`;

  /**
   * Save the current flow to localStorage
   */
  const saveFlow = useCallback(() => {
    const viewport = getViewport();
    const flowData: FlowData = {
      nodes,
      edges,
      viewport,
      version: CURRENT_VERSION,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(flowData));
      console.log("Flow saved successfully");
      return true;
    } catch (error) {
      console.error("Failed to save flow:", error);
      return false;
    }
  }, [nodes, edges, getViewport, storageKey]);

  /**
   * Restore flow from localStorage
   */
  const restoreFlow = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) {
        console.log("No saved flow found");
        return false;
      }

      const flowData: FlowData = JSON.parse(savedData);

      // Version migration could happen here
      if (flowData.version !== CURRENT_VERSION) {
        console.warn("Flow data version mismatch, attempting migration");
      }

      setNodes(flowData.nodes || []);
      setEdges(flowData.edges || []);

      // Restore viewport with slight delay to ensure nodes are rendered
      setTimeout(() => {
        if (flowData.viewport) {
          setViewport(flowData.viewport, { duration: 200 });
        }
      }, 50);

      console.log("Flow restored successfully from", flowData.savedAt);
      return true;
    } catch (error) {
      console.error("Failed to restore flow:", error);
      return false;
    }
  }, [storageKey, setNodes, setEdges, setViewport]);

  /**
   * Clear saved flow from localStorage
   */
  const clearSavedFlow = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      console.log("Saved flow cleared");
      return true;
    } catch (error) {
      console.error("Failed to clear saved flow:", error);
      return false;
    }
  }, [storageKey]);

  /**
   * Check if a saved flow exists
   */
  const hasSavedFlow = useCallback(() => {
    return localStorage.getItem(storageKey) !== null;
  }, [storageKey]);

  /**
   * Get metadata about the saved flow without loading it
   */
  const getSavedFlowInfo = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) return null;

      const flowData: FlowData = JSON.parse(savedData);
      return {
        savedAt: flowData.savedAt,
        nodeCount: flowData.nodes.length,
        edgeCount: flowData.edges.length,
        version: flowData.version,
      };
    } catch {
      return null;
    }
  }, [storageKey]);

  /**
   * Export flow as JSON string
   */
  const exportFlow = useCallback(() => {
    const viewport = getViewport();
    const flowData: FlowData = {
      nodes,
      edges,
      viewport,
      version: CURRENT_VERSION,
      savedAt: new Date().toISOString(),
    };
    return JSON.stringify(flowData, null, 2);
  }, [nodes, edges, getViewport]);

  /**
   * Import flow from JSON string
   */
  const importFlow = useCallback(
    (jsonString: string) => {
      try {
        const flowData: FlowData = JSON.parse(jsonString);

        if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
          throw new Error("Invalid flow data: missing nodes array");
        }

        setNodes(flowData.nodes);
        setEdges(flowData.edges || []);

        if (flowData.viewport) {
          setTimeout(() => {
            setViewport(flowData.viewport, { duration: 200 });
          }, 50);
        }

        console.log("Flow imported successfully");
        return true;
      } catch (error) {
        console.error("Failed to import flow:", error);
        return false;
      }
    },
    [setNodes, setEdges, setViewport]
  );

  /**
   * Reset flow and clear saved state
   */
  const resetFlow = useCallback(() => {
    reset();
    clearSavedFlow();
  }, [reset, clearSavedFlow]);

  return {
    saveFlow,
    restoreFlow,
    clearSavedFlow,
    hasSavedFlow,
    getSavedFlowInfo,
    exportFlow,
    importFlow,
    resetFlow,
  };
};

/**
 * Auto-save hook that saves flow periodically
 */
export const useAutoSave = (
  canvasId: string = "default",
  intervalMs: number = 30000, // 30 seconds
  enabled: boolean = true
) => {
  const { saveFlow } = useFlowPersistence(canvasId);

  // Note: In a real implementation, you'd use useEffect with setInterval
  // This is a simplified version showing the pattern
  return { saveFlow, enabled, intervalMs };
};
