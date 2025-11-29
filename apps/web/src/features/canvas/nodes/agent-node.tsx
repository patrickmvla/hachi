"use client";

import { memo } from "react";
import { Handle, Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { Bot, GripVertical } from "lucide-react";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";

export const AgentNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <div
        className={`relative rounded-lg border-2 bg-[var(--background)] min-w-[200px] min-h-[90px] shadow-sm transition-all group ${
          selected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"
        }`}
      >
        <NodeResizeControl
          minWidth={200}
          minHeight={90}
          style={{ background: "transparent", border: "none" }}
          position="bottom-right"
        >
          <div className="absolute bottom-1 right-1 cursor-se-resize opacity-50 group-hover:opacity-100 transition-opacity">
            <GripVertical size={12} className="text-[var(--muted-foreground)]" />
          </div>
        </NodeResizeControl>

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-[var(--muted-foreground)] !border-2 !border-[var(--background)]"
        />

        <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]/30 rounded-t-md">
          <Bot size={14} className="text-green-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Agent
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-1">{data.label}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] bg-[var(--muted)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded">
              Web Search
            </span>
            <span className="text-[10px] bg-[var(--muted)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded">
              Code Exec
            </span>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-[var(--primary)] !border-2 !border-[var(--background)]"
        />
      </div>
    </>
  );
});

AgentNode.displayName = "AgentNode";
