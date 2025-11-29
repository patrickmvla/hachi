"use client";

import { memo } from "react";
import { Handle, Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { Cpu, Sparkles, GripVertical } from "lucide-react";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";

export const GenerateNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="overlay">
        <div
          className={`relative rounded-lg border-2 bg-[var(--background)] min-w-[220px] min-h-[100px] shadow-sm transition-all group ${
            selected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"
          }`}
        >
        <NodeResizeControl
          minWidth={220}
          minHeight={100}
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
          <Cpu size={14} className="text-purple-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Generate
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">{data.label}</div>
            <Sparkles size={12} className="text-purple-500" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
              <span>Model</span>
              <span className="font-mono text-[var(--foreground)]">gpt-4-turbo</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
              <span>Temp</span>
              <span className="font-mono text-[var(--foreground)]">0.7</span>
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-[var(--primary)] !border-2 !border-[var(--background)]"
        />
        </div>
      </NodeStatusIndicator>
    </>
  );
});

GenerateNode.displayName = "GenerateNode";
