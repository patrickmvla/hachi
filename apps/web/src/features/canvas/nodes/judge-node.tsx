"use client";

import { memo } from "react";
import { Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { Scale, GripVertical } from "lucide-react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";
import { TypedHandle } from "../components/typed-handle";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

export const JudgeNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";
  const defaults = nodeDefaults.judge;
  const cfg = data.config ?? {};
  const criteria = getConfigValue<string>(cfg, defaults, "criteria");
  const threshold = getConfigValue<number>(cfg, defaults, "confidenceThreshold");

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="overlay">
      <div
        className={`relative rounded-lg border-2 bg-background min-w-[200px] min-h-[80px] shadow-sm transition-all group ${
          selected ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
        role="group"
        aria-label={`Judge node: ${data.label}`}
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
          portType={PortType.Documents}
        />

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 rounded-t-md">
          <Scale size={14} className="text-red-500" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Judge
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-1">{data.label}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded capitalize">
              {criteria}
            </span>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {(threshold * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <TypedHandle
          type="source"
          position={Position.Bottom}
          portType={PortType.Judgments}
        />
      </div>
      </NodeStatusIndicator>
    </>
  );
});

JudgeNode.displayName = "JudgeNode";
