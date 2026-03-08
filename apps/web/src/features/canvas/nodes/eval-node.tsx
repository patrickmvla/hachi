"use client";

import { memo } from "react";
import { Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import { BarChart3, GripVertical } from "lucide-react";
import { PortType } from "@hachi/schemas/nodes";
import type { HachiNode } from "@/stores/canvas-store";
import { NodeToolbar } from "../components/node-toolbar";
import { NodeStatusIndicator } from "../components/node-status-indicator";
import { TypedHandle } from "../components/typed-handle";
import { getConfigValue, nodeDefaults } from "../config/node-defaults";

const METRIC_LABELS: Record<string, string> = {
  faithfulness: "Faithfulness",
  relevancy: "Relevancy",
  context_precision: "Context Precision",
};

const METRIC_INPUTS: Record<string, PortType[]> = {
  faithfulness: [PortType.Query, PortType.Response, PortType.Documents],
  relevancy: [PortType.Query, PortType.Response],
  context_precision: [PortType.Query, PortType.Documents],
};

function getScoreColor(score: number): string {
  if (score >= 0.7) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 0.5) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
}

export const EvalNode = memo(({ id, data, selected }: NodeProps<HachiNode>) => {
  const status = data.status || "initial";
  const defaults = nodeDefaults.evaluator;
  const cfg = data.config ?? {};
  const metric = getConfigValue<string>(cfg, defaults, "metric");
  const inputPorts = METRIC_INPUTS[metric] ?? METRIC_INPUTS.faithfulness!;

  // Score from execution output (if available)
  const output = data.output as { score?: number } | undefined;
  const score = output?.score;

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected ?? false} />
      <NodeStatusIndicator status={status} variant="overlay">
      <div
        className={`relative rounded-lg border-2 bg-background min-w-[200px] min-h-[80px] shadow-sm transition-all group ${
          selected ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
        role="group"
        aria-label={`Evaluator node: ${data.label}`}
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

        {/* Input handles based on selected metric */}
        {inputPorts.map((portType, i) => (
          <TypedHandle
            key={portType}
            type="target"
            position={Position.Top}
            portType={portType}
            id={`${portType}-${i}`}
            style={{ left: `${((i + 1) / (inputPorts.length + 1)) * 100}%` }}
          />
        ))}

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 rounded-t-md">
          <BarChart3 size={14} className="text-yellow-500" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evaluator
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm font-medium mb-1">{data.label}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded">
              {METRIC_LABELS[metric] ?? metric}
            </span>
            {score !== undefined && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${getScoreColor(score)}`}>
                {(score * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        <TypedHandle
          type="source"
          position={Position.Bottom}
          portType={PortType.EvalScore}
        />
      </div>
      </NodeStatusIndicator>
    </>
  );
});

EvalNode.displayName = "EvalNode";
