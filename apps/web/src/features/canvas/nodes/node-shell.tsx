"use client";

import { Position } from "@xyflow/react";
import { Zap } from "lucide-react";
import { PortType } from "@hachi/schemas/nodes";
import { nodeRegistry, getNodeConfigSummary } from "@/features/playground/config/node-registry";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { NodeToolbar } from "../components/node-toolbar";
import { TypedHandle } from "../components/typed-handle";

export type NodeStatus = "initial" | "loading" | "success" | "error";

interface NodeShellProps {
  id: string;
  selected: boolean;
  data: { label: string; type: string; config?: Record<string, unknown>; status?: NodeStatus };
  inputs: PortType[];
  outputs: PortType[];
}

const STATUS_DOT: Record<NodeStatus, string> = {
  initial: "hidden",
  loading: "bg-blue-500 animate-pulse",
  success: "bg-green-500",
  error: "bg-red-500",
};

export const NodeShell = ({ id, selected, data, inputs, outputs }: NodeShellProps) => {
  const entry = nodeRegistry[data.type];
  const Icon = entry?.icon;
  const colorClass = entry?.color ?? "text-muted-foreground";
  const status: NodeStatus = data.status ?? "initial";

  const configSummary = getNodeConfigSummary(data.type, data.config);

  const logEntry = useExecutionLogStore((s) => s.getEntryByNodeId(id));
  const latencyMs = logEntry?.status === "success" ? logEntry.latencyMs : undefined;

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={selected} />

      {/* Input handles */}
      {inputs.map((portType, i) => (
        <TypedHandle
          key={`in-${portType}`}
          type="target"
          position={Position.Top}
          portType={portType}
          style={
            inputs.length > 1
              ? { left: `${((i + 1) / (inputs.length + 1)) * 100}%` }
              : undefined
          }
        />
      ))}

      <div
        className={`relative w-[160px] rounded-lg border border-border bg-background shadow-sm transition-all`}
        role="group"
        aria-label={`${data.type} node: ${data.label}`}
      >
        <div className="px-3 py-2 space-y-0.5">
          {/* Row 1: Icon + label + status dot */}
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={14} className={`shrink-0 ${colorClass}`} aria-hidden="true" />}
            <span className="text-xs font-medium truncate flex-1">{data.label}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status]}`}
              aria-label={status !== "initial" ? `Status: ${status}` : undefined}
            />
          </div>

          {/* Row 2: Config summary */}
          {configSummary && (
            <div className="text-[10px] text-muted-foreground truncate">{configSummary}</div>
          )}

          {/* Row 3: Execution metrics */}
          {latencyMs !== undefined && (
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Zap size={8} aria-hidden="true" />
              <span>{latencyMs}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Output handles */}
      {outputs.map((portType, i) => (
        <TypedHandle
          key={`out-${portType}`}
          type="source"
          position={Position.Bottom}
          portType={portType}
          style={
            outputs.length > 1
              ? { left: `${((i + 1) / (outputs.length + 1)) * 100}%` }
              : undefined
          }
        />
      ))}
    </>
  );
};
