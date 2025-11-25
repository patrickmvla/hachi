"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { HachiNode } from "@/stores/canvas-store";

export function BaseNode({ data, selected }: NodeProps<HachiNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-[var(--background)] min-w-[150px] ${
        selected ? "border-[var(--primary)]" : "border-[var(--border)]"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
          {data.type}
        </span>
        <span className="font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
