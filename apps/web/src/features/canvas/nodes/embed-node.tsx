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
        className={`relative rounded-lg border-2 bg-[var(--background)] min-w-[200px] min-h-[80px] shadow-sm transition-all group ${
          selected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"
        }`}
      >
        <NodeResizeControl
          minWidth={200}
          minHeight={80}
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
          <GitBranch size={14} className="text-pink-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Embedding
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-1">{data.label}</div>
          <div className="text-[10px] text-[var(--muted-foreground)]">
            Model: <span className="font-mono text-[var(--foreground)]">text-embedding-3-small</span>
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

EmbedNode.displayName = "EmbedNode";
