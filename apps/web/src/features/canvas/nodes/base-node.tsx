"use client";

import { memo } from "react";
import { Handle, Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { GripVertical } from "lucide-react";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";

const ResizeIcon = () => (
  <GripVertical
    size={12}
    className="text-[var(--muted-foreground)] opacity-50 group-hover:opacity-100 transition-opacity"
  />
);

export const BaseNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="border">
        <div
          className={`relative px-4 py-3 rounded-lg border-2 bg-[var(--background)] min-w-[150px] min-h-[60px] group ${
            selected ? "border-[var(--primary)]" : "border-[var(--border)]"
          }`}
        >
          <NodeResizeControl
            minWidth={150}
            minHeight={60}
            style={{
              background: "transparent",
              border: "none",
            }}
            position="bottom-right"
          >
            <div className="absolute bottom-1 right-1 cursor-se-resize">
              <ResizeIcon />
            </div>
          </NodeResizeControl>

          <Handle
            type="target"
            position={Position.Top}
            className="!w-3 !h-3 !bg-[var(--muted-foreground)] !border-2 !border-[var(--background)]"
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              {data.type}
            </span>
            <span className="font-medium">{data.label}</span>
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-[var(--muted-foreground)] !border-2 !border-[var(--background)]"
          />
        </div>
      </NodeStatusIndicator>
    </>
  );
});

BaseNode.displayName = "BaseNode";
