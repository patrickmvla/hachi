"use client";

import { memo, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeToolbar,
  type EdgeProps,
} from "@xyflow/react";
import { Activity, Trash2, Settings } from "lucide-react";
import { useCanvasStore, type HachiEdge } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { getEdgePath, type EdgePathStyle } from "../utils/edge-path-utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@hachi/ui/components/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@hachi/ui/components/dialog";
import { JsonViewer } from "../wire-tap/json-viewer";

// Data type colors for edge labels
const dataTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  string: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-300 dark:border-blue-700" },
  vector: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-300 dark:border-purple-700" },
  document: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", border: "border-green-300 dark:border-green-700" },
  json: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-300 dark:border-orange-700" },
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
  const deleteEdge = useCanvasStore((s) => s.deleteEdge);
  const getEdgeData = useExecutionLogStore((s) => s.getEdgeData);
  const [inspectOpen, setInspectOpen] = useState(false);

  const dataType = data?.dataType || "json";
  const pathStyle: EdgePathStyle = data?.pathStyle || "bezier";
  const animated = data?.animated || false;
  const colors = dataTypeColors[dataType] ?? dataTypeColors.json!;

  const edgeData = getEdgeData(source);

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

  // Truncated preview of edge data
  const previewText = edgeData
    ? JSON.stringify(edgeData, null, 2).slice(0, 300)
    : null;

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
          <HoverCard openDelay={400}>
            <HoverCardTrigger asChild>
              <span
                className={`
                  text-[9px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider cursor-default
                  ${colors.bg} ${colors.text} ${colors.border}
                  ${selected ? "opacity-100" : "opacity-70"}
                  transition-opacity
                `}
              >
                {dataType}
              </span>
            </HoverCardTrigger>
            {previewText && (
              <HoverCardContent className="w-72 p-0" side="top">
                <pre className="text-[10px] font-mono p-3 max-h-48 overflow-auto text-muted-foreground leading-relaxed">
                  {previewText}
                  {previewText.length >= 300 && "..."}
                </pre>
              </HoverCardContent>
            )}
          </HoverCard>

          {/* Inspect button */}
          <button
            className={`
              w-5 h-5 rounded-full flex items-center justify-center border transition-all
              ${selected
                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
              }
            `}
            onClick={(event) => {
              event.stopPropagation();
              setInspectOpen(true);
            }}
            title="Inspect data flow"
            aria-label="Inspect data flow"
          >
            <Activity size={10} aria-hidden="true" />
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
        <div className="flex items-center gap-0.5 p-1 rounded-lg border border-border bg-background shadow-lg" role="toolbar" aria-label="Edge actions">
          <button
            onClick={() => console.log("Edge settings", id)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Settings"
            aria-label="Edge settings"
          >
            <Settings size={12} aria-hidden="true" />
          </button>
          <div className="w-px h-4 bg-border" aria-hidden="true" />
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete"
            aria-label="Delete edge"
          >
            <Trash2 size={12} aria-hidden="true" />
          </button>
        </div>
      </EdgeToolbar>

      {/* Inspect dialog */}
      {inspectOpen && (
        <Dialog open={inspectOpen} onOpenChange={setInspectOpen}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-sm">
                Edge Data — <span className="uppercase text-muted-foreground">{dataType}</span>
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
