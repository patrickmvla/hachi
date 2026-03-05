"use client";

import { memo } from "react";
import { Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { GitBranch, GripVertical } from "lucide-react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";
import { TypedHandle } from "../components/typed-handle";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

export const EmbedNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";
  const model = getConfigValue<string>(data.config ?? {}, nodeDefaults.embedding, "model");

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="overlay">
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

        <TypedHandle
          type="target"
          position={Position.Top}
          portType={PortType.Text}
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
            Model: <span className="font-mono text-foreground">{model}</span>
          </div>
        </div>

        <TypedHandle
          type="source"
          position={Position.Bottom}
          portType={PortType.Embedding}
        />
      </div>
      </NodeStatusIndicator>
    </>
  );
});

EmbedNode.displayName = "EmbedNode";
