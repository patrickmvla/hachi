"use client";

import { memo } from "react";
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import type { HachiEdge } from "@/stores/canvas-store";

/**
 * Animated edge with particle flowing along the path
 * Uses SVG animateMotion for smooth animation
 */
export const AnimatedEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps<HachiEdge>) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const particleColor = selected ? "var(--primary)" : "var(--muted-foreground)";
  const strokeColor = selected ? "var(--primary)" : "var(--muted-foreground)";

  return (
    <>
      {/* Base edge path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1.5,
          stroke: strokeColor,
          opacity: 0.5,
        }}
      />

      {/* Animated particle */}
      <circle r="4" fill={particleColor}>
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>

      {/* Trail effect - multiple smaller particles */}
      <circle r="3" fill={particleColor} opacity={0.6}>
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
          begin="-0.2s"
        />
      </circle>
      <circle r="2" fill={particleColor} opacity={0.4}>
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
          begin="-0.4s"
        />
      </circle>
    </>
  );
});

AnimatedEdge.displayName = "AnimatedEdge";
