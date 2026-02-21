import { useEffect, useRef } from "react";
import { useCanvasStore, type HachiNode, type HachiEdge } from "@/stores/canvas-store";
import { useCanvas } from "./use-canvas-queries";

export function useCanvasEditor(canvasId: string) {
  const query = useCanvas(canvasId);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query.data || initializedRef.current === canvasId) return;

    const graphJson = query.data.graphJson || { nodes: [], edges: [] };
    setNodes((graphJson.nodes || []) as HachiNode[]);
    setEdges((graphJson.edges || []) as HachiEdge[]);
    initializedRef.current = canvasId;
  }, [query.data, canvasId, setNodes, setEdges]);

  // Reset when canvasId changes so the next fetch re-initializes the store
  useEffect(() => {
    initializedRef.current = null;
  }, [canvasId]);

  return query;
}
