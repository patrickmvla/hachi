"use client";

import { memo } from "react";
import {
  BaseEdge,
  type EdgeProps,
  useStore,
} from "@xyflow/react";
import type { HachiEdge } from "@/stores/canvas-store";

/**
 * Get a special curved path that offsets for bi-directional edges
 */
function getSpecialPath(
  { sourceX, sourceY, targetX, targetY }: { sourceX: number; sourceY: number; targetX: number; targetY: number },
  offset: number
) {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  // Create a quadratic bezier curve with offset control point
  return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
}

/**
 * Bi-directional edge that offsets when there's an edge going the other direction
 * Useful for showing data flow in both directions without overlapping
 */
export const BidirectionalEdge = memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  selected,
}: EdgeProps<HachiEdge>) => {
  // Check if there's an edge going in the opposite direction
  const hasOpposingEdge = useStore((store) => {
    return store.edges.some(
      (edge) => edge.source === target && edge.target === source
    );
  });

  // Calculate offset for bi-directional edge separation
  const offset = hasOpposingEdge ? 25 : 0;

  const edgePath = getSpecialPath(
    { sourceX, sourceY, targetX, targetY },
    offset
  );

  // Calculate label position at the midpoint
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 + offset / 2;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1.5,
          stroke: selected ? "var(--primary)" : "var(--muted-foreground)",
        }}
      />
    </>
  );
});

BidirectionalEdge.displayName = "BidirectionalEdge";
