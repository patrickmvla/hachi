import { memo } from "react";
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";

type PlaygroundEdgeData = {
  animated?: boolean;
};

export const PlaygroundEdge = memo(function PlaygroundEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps<Edge<PlaygroundEdgeData>>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: data?.animated ? "hsl(var(--primary))" : "hsl(var(--border))",
        strokeWidth: data?.animated ? 2 : 1.5,
        transition: "stroke 0.3s, stroke-width 0.3s",
      }}
    />
  );
});
