"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeToolbar,
  type EdgeProps,
} from "@xyflow/react";
import { Activity, Trash2, Settings } from "lucide-react";
import { useCanvasStore, type HachiEdge } from "@/stores/canvas-store";
import { getEdgePath, type EdgePathStyle } from "../utils/edge-path-utils";

// Data type colors for edge labels
const dataTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  string: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-300 dark:border-blue-700" },
  vector: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-300 dark:border-purple-700" },
  document: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", border: "border-green-300 dark:border-green-700" },
  json: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-300 dark:border-orange-700" },
};

export const DataEdge = memo(({
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
  const deleteEdge = useCanvasStore((s) => s.deleteEdge);
  const dataType = data?.dataType || "json";
  const pathStyle: EdgePathStyle = data?.pathStyle || "bezier";
  const animated = data?.animated || false;
  const colors = dataTypeColors[dataType] ?? dataTypeColors.json!;

  const { path: edgePath, labelX, labelY } = getEdgePath(
    pathStyle,
    {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    },
    { curvature: 0.25, borderRadius: 5 }
  );

  const handleDelete = () => {
    deleteEdge(id);
  };

  return (
    <>
      {/* Edge path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1.5,
          stroke: selected ? "var(--primary)" : "var(--muted-foreground)",
          ...(animated && {
            strokeDasharray: 5,
            animation: "flow 0.5s linear infinite",
          }),
        }}
      />

      {/* Edge label with data type and inspect button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-1"
        >
          {/* Data type badge */}
          <span
            className={`
              text-[9px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider
              ${colors.bg} ${colors.text} ${colors.border}
              ${selected ? "opacity-100" : "opacity-70"}
              transition-opacity
            `}
          >
            {dataType}
          </span>

          {/* Inspect button */}
          <button
            className={`
              w-5 h-5 rounded-full flex items-center justify-center border transition-all
              ${selected
                ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }
            `}
            onClick={(event) => {
              event.stopPropagation();
              console.log("Inspect edge data", id);
            }}
            title="Inspect data flow"
          >
            <Activity size={10} />
          </button>
        </div>
      </EdgeLabelRenderer>

      {/* Edge toolbar (visible when selected) */}
      <EdgeToolbar
        edgeId={id}
        x={labelX + 60}
        y={labelY}
        isVisible={selected}
        alignX="left"
        alignY="center"
      >
        <div className="flex items-center gap-0.5 p-1 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg">
          <button
            onClick={() => console.log("Edge settings", id)}
            className="p-1.5 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Settings"
          >
            <Settings size={12} />
          </button>
          <div className="w-px h-4 bg-[var(--border)]" />
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-md text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </EdgeToolbar>
    </>
  );
});

DataEdge.displayName = "DataEdge";
