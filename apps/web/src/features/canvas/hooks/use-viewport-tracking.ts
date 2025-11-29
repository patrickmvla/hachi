"use client";

import { useCallback, useState } from "react";
import { useOnViewportChange, type Viewport } from "@xyflow/react";

interface ViewportState {
  viewport: Viewport;
  isMoving: boolean;
  lastMoveTime: number | null;
}

/**
 * Hook to track viewport changes with movement state
 */
export const useViewportTracking = () => {
  const [state, setState] = useState<ViewportState>({
    viewport: { x: 0, y: 0, zoom: 1 },
    isMoving: false,
    lastMoveTime: null,
  });

  const onStart = useCallback((viewport: Viewport) => {
    setState((prev) => ({
      ...prev,
      viewport,
      isMoving: true,
    }));
  }, []);

  const onChange = useCallback((viewport: Viewport) => {
    setState((prev) => ({
      ...prev,
      viewport,
    }));
  }, []);

  const onEnd = useCallback((viewport: Viewport) => {
    setState((prev) => ({
      ...prev,
      viewport,
      isMoving: false,
      lastMoveTime: Date.now(),
    }));
  }, []);

  useOnViewportChange({ onStart, onChange, onEnd });

  return state;
};
