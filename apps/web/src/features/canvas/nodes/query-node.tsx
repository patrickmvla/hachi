"use client";

import { memo } from "react";
import { Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { Search, GripVertical } from "lucide-react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";
import { TypedHandle } from "../components/typed-handle";

export const QueryNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="overlay">
      <div
        className={`relative rounded-lg border-2 bg-background min-w-[200px] min-h-[80px] shadow-sm transition-all group ${
          selected ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
        role="group"
        aria-label={`Query node: ${data.label}`}
      >
        <NodeResizeControl
          minWidth={200}
          minHeight={80}
          style={{ background: "transparent", border: "none" }}
          position="bottom-right"
        >
          <div className="absolute bottom-1 right-1 cursor-se-resize opacity-50 group-hover:opacity-100 transition-opacity">
            <GripVertical size={12} className="text-muted-foreground" aria-hidden="true" />
          </div>
        </NodeResizeControl>

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 rounded-t-md">
          <Search size={14} className="text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Query
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-2">{data.label}</div>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded border border-border font-mono">
            User Input
          </div>
        </div>

        <TypedHandle
          type="source"
          position={Position.Bottom}
          portType={PortType.Query}
        />
      </div>
      </NodeStatusIndicator>
    </>
  );
});

QueryNode.displayName = "QueryNode";
