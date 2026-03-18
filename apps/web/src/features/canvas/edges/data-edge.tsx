"use client";

import { memo, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { useCanvasStore, type HachiEdge } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { getEdgePath, type EdgePathStyle } from "../utils/edge-path-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@hachi/ui/components/dialog";
import { JsonViewer } from "../wire-tap/json-viewer";

const DOT_COLORS: Record<string, string> = {
  string: "#3b82f6",
  vector: "#a855f7",
  document: "#22c55e",
  json: "#f97316",
};

const DATA_TYPE_LABELS: Record<string, string> = {
  string: "String",
  vector: "Vector",
  document: "Document",
  json: "JSON",
};

export const DataEdge = memo(({
  id,
  source,
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
  const { deleteElements } = useReactFlow();
  const getEdgeData = useExecutionLogStore((s) => s.getEdgeData);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const dataType = data?.dataType || "json";
  const pathStyle: EdgePathStyle = data?.pathStyle || "bezier";
  const animated = data?.animated || false;
  const dotColor = DOT_COLORS[dataType] ?? DOT_COLORS.json!;

  const edgeData = getEdgeData(source);
  const hasData = !!edgeData;

  const { path: edgePath, labelX, labelY } = getEdgePath(
    pathStyle,
    { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition },
    { curvature: 0.25, borderRadius: 5 },
  );

  const previewText = edgeData
    ? JSON.stringify(edgeData, null, 2).slice(0, 300)
    : null;

  const showExpanded = hovered || selected;

  return (
    <>
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

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {showExpanded ? (
            /* Expanded: type label + actions */
            <div className="flex items-center gap-1 px-1.5 py-1 rounded-md border border-border bg-background shadow-sm transition-all">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">
                {DATA_TYPE_LABELS[dataType] ?? "JSON"}
              </span>

              {hasData && (
                <button
                  className="ml-0.5 text-[10px] text-primary hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectOpen(true);
                  }}
                >
                  inspect
                </button>
              )}

              <button
                className="ml-0.5 p-0.5 rounded text-muted-foreground hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElements({ edges: [{ id }] });
                }}
                aria-label="Delete edge"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ) : (
            /* Collapsed: small colored dot */
            <div
              className="w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-150"
              style={{ backgroundColor: dotColor }}
              title={DATA_TYPE_LABELS[dataType] ?? "JSON"}
            />
          )}
        </div>
      </EdgeLabelRenderer>

      {inspectOpen && (
        <Dialog open={inspectOpen} onOpenChange={setInspectOpen}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                {DATA_TYPE_LABELS[dataType] ?? "JSON"} data
              </DialogTitle>
            </DialogHeader>
            {edgeData ? (
              <JsonViewer data={edgeData} />
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No execution data available. Run the pipeline first.
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});

DataEdge.displayName = "DataEdge";
