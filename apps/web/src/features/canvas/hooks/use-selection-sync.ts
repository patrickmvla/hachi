"use client";

import { useCallback } from "react";
import { useOnSelectionChange } from "@xyflow/react";
import { useCanvasStore } from "@/stores/canvas-store";

/**
 * Hook to sync React Flow selection state with our zustand store
 */
export const useSelectionSync = () => {
  const setSelection = useCanvasStore((s) => s.setSelection);

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: { id: string }[]; edges: { id: string }[] }) => {
      setSelection(
        nodes.map((n) => n.id),
        edges.map((e) => e.id)
      );
    },
    [setSelection]
  );

  useOnSelectionChange({ onChange });
};
