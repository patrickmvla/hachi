"use client";

import { memo } from "react";
import { Handle, Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { GitBranch, GripVertical } from "lucide-react";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";

export const EmbedNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <div
        className={`relative rounded-lg border-2 bg-background min-w-[200px] min-h-[80px] shadow-sm transition-all group ${
          selected ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
        role="group"
        aria-label={`Embedding node: ${data.label}`}
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

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
        />

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 rounded-t-md">
          <GitBranch size={14} className="text-pink-500" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Embedding
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-1">{data.label}</div>
          <div className="text-[10px] text-muted-foreground">
            Model: <span className="font-mono text-foreground">text-embedding-3-small</span>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-primary !border-2 !border-background"
        />
      </div>
    </>
  );
});

EmbedNode.displayName = "EmbedNode";
