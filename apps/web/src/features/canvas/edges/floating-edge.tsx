"use client";

import { memo, useMemo } from "react";
import {
  BaseEdge,
  getBezierPath,
  useInternalNode,
  Position,
  type EdgeProps,
  type InternalNode,
} from "@xyflow/react";
import type { HachiEdge, HachiNode } from "@/stores/canvas-store";

/**
 * Get the center point of a node
 */
function getNodeCenter(node: InternalNode<HachiNode>) {
  return {
    x: node.position.x + (node.measured?.width ?? 0) / 2,
    y: node.position.y + (node.measured?.height ?? 0) / 2,
  };
}

/**
 * Calculate edge parameters for floating connection
 */
function getEdgeParams(
  source: InternalNode<HachiNode>,
  target: InternalNode<HachiNode>
) {
  const sourceCenter = getNodeCenter(source);
  const targetCenter = getNodeCenter(target);

  const horizontalDiff = Math.abs(sourceCenter.x - targetCenter.x);
  const verticalDiff = Math.abs(sourceCenter.y - targetCenter.y);

  let sourcePos: Position;
  let targetPos: Position;

  // Determine positions based on relative node locations
  if (horizontalDiff > verticalDiff) {
    // More horizontal separation
    if (sourceCenter.x < targetCenter.x) {
      sourcePos = Position.Right;
      targetPos = Position.Left;
    } else {
      sourcePos = Position.Left;
      targetPos = Position.Right;
    }
  } else {
    // More vertical separation
    if (sourceCenter.y < targetCenter.y) {
      sourcePos = Position.Bottom;
      targetPos = Position.Top;
    } else {
      sourcePos = Position.Top;
      targetPos = Position.Bottom;
    }
  }

  // Calculate actual connection points
  const sourceWidth = source.measured?.width ?? 100;
  const sourceHeight = source.measured?.height ?? 50;
  const targetWidth = target.measured?.width ?? 100;
  const targetHeight = target.measured?.height ?? 50;

  let sourceX: number, sourceY: number, targetX: number, targetY: number;

  switch (sourcePos) {
    case Position.Top:
      sourceX = source.position.x + sourceWidth / 2;
      sourceY = source.position.y;
      break;
    case Position.Bottom:
      sourceX = source.position.x + sourceWidth / 2;
      sourceY = source.position.y + sourceHeight;
      break;
    case Position.Left:
      sourceX = source.position.x;
      sourceY = source.position.y + sourceHeight / 2;
      break;
    case Position.Right:
      sourceX = source.position.x + sourceWidth;
      sourceY = source.position.y + sourceHeight / 2;
      break;
  }

  switch (targetPos) {
    case Position.Top:
      targetX = target.position.x + targetWidth / 2;
      targetY = target.position.y;
      break;
    case Position.Bottom:
      targetX = target.position.x + targetWidth / 2;
      targetY = target.position.y + targetHeight;
      break;
    case Position.Left:
      targetX = target.position.x;
      targetY = target.position.y + targetHeight / 2;
      break;
    case Position.Right:
      targetX = target.position.x + targetWidth;
      targetY = target.position.y + targetHeight / 2;
      break;
  }

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  };
}

/**
 * Floating edge that connects to the closest side of nodes
 */
export const FloatingEdge = memo(({
  id,
  source,
  target,
  style = {},
  markerEnd,
  selected,
}: EdgeProps<HachiEdge>) => {
  const sourceNode = useInternalNode<HachiNode>(source);
  const targetNode = useInternalNode<HachiNode>(target);

  const edgeParams = useMemo(() => {
    if (!sourceNode || !targetNode) return null;
    return getEdgeParams(sourceNode, targetNode);
  }, [sourceNode, targetNode]);

  if (!edgeParams) return null;

  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = edgeParams;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: selected ? 2 : 1.5,
        stroke: selected ? "var(--primary)" : "var(--muted-foreground)",
      }}
    />
  );
});

FloatingEdge.displayName = "FloatingEdge";
