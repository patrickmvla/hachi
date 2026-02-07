import { useEffect, useRef, useCallback, useState } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import { canvasesApi } from "@/lib/api";

interface UseAutoSaveOptions {
  canvasId: string;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

/**
 * Hook to auto-save canvas changes to the backend API
 * This is different from useAutoSave in use-flow-persistence.ts which saves to localStorage
 */
export function useBackendAutoSave({
  canvasId,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions) {
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);

  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<string>("");

  const save = useCallback(async () => {
    if (!enabled || !canvasId) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));

    try {
      const { error } = await canvasesApi.update(canvasId, {
        graphJson: { nodes, edges },
      });

      if (error) {
        setState((prev) => ({ ...prev, isSaving: false, error }));
      } else {
        setState({
          isSaving: false,
          lastSaved: new Date(),
          error: null,
        });
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error: "Failed to save changes",
      }));
    }
  }, [canvasId, nodes, edges, enabled]);

  // Debounced auto-save on changes
  useEffect(() => {
    if (!enabled) return;

    // Serialize current state to detect changes
    const currentData = JSON.stringify({ nodes, edges });

    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) return;
    previousDataRef.current = currentData;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced save
    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, save, debounceMs, enabled]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  return {
    ...state,
    saveNow,
  };
}
