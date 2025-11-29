"use client";

import {
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getSimpleBezierPath,
  Position,
} from "@xyflow/react";

export type EdgePathStyle = "bezier" | "smoothstep" | "straight" | "simplebezier";

export interface EdgePathParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export interface EdgePathResult {
  path: string;
  labelX: number;
  labelY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Get edge path based on style
 */
export const getEdgePath = (
  style: EdgePathStyle,
  params: EdgePathParams,
  options: {
    curvature?: number;
    borderRadius?: number;
    offset?: number;
  } = {}
): EdgePathResult => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
  } = params;

  const { curvature = 0.25, borderRadius = 5, offset = 20 } = options;

  let result: [string, number, number, number, number];

  switch (style) {
    case "smoothstep":
      result = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius,
        offset,
      });
      break;

    case "straight":
      result = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      break;

    case "simplebezier":
      result = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      break;

    case "bezier":
    default:
      result = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature,
      });
      break;
  }

  const [path, labelX, labelY, offsetX, offsetY] = result;
  return { path, labelX, labelY, offsetX, offsetY };
};

/**
 * Calculate the approximate length of a bezier path
 */
export const estimatePathLength = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): number => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get animated dash offset for flowing edge animation
 */
export const getFlowAnimationOffset = (
  timestamp: number,
  speed: number = 50
): number => {
  return (timestamp / speed) % 100;
};

/**
 * Edge style presets for different data types
 */
export const edgeStylePresets: Record<
  string,
  {
    pathStyle: EdgePathStyle;
    animated: boolean;
    strokeWidth: number;
    color: string;
  }
> = {
  data: {
    pathStyle: "bezier",
    animated: false,
    strokeWidth: 1.5,
    color: "var(--muted-foreground)",
  },
  streaming: {
    pathStyle: "bezier",
    animated: true,
    strokeWidth: 2,
    color: "var(--primary)",
  },
  error: {
    pathStyle: "smoothstep",
    animated: false,
    strokeWidth: 2,
    color: "var(--destructive)",
  },
  conditional: {
    pathStyle: "smoothstep",
    animated: false,
    strokeWidth: 1.5,
    color: "var(--warning)",
  },
};
