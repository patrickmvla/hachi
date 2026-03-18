"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";
import { GanttChart } from "../../wire-tap/gantt-chart";
import { CostBreakdown } from "../../wire-tap/cost-breakdown";

interface ExecutionPerfProps {
  entry: ExecutionLogEntry;
  allEntries: ExecutionLogEntry[];
  nodeId: string;
}

export const ExecutionPerf = ({ entry, allEntries, nodeId }: ExecutionPerfProps) => {
  const trace = entry.trace;

  return (
    <div className="space-y-4 p-4">
      {/* Trace summary grid — always shown */}
      <div className="space-y-1 text-[10px]">
        <div className="font-semibold text-muted-foreground uppercase tracking-wider">
          Trace
        </div>
        <div className="grid grid-cols-2 gap-1 bg-muted/30 rounded-md p-2 border border-border">
          <span className="text-muted-foreground">Model</span>
          <span className="font-mono">{trace?.model ?? "—"}</span>
          <span className="text-muted-foreground">Latency</span>
          <span className="font-mono">{entry.latencyMs > 0 ? `${entry.latencyMs}ms` : "0ms"}</span>
          <span className="text-muted-foreground">Tokens</span>
          <span className="font-mono">{trace?.tokenCount?.total?.toLocaleString() ?? "0"}</span>
          <span className="text-muted-foreground">Cost</span>
          <span className="font-mono text-amber-600">
            ${trace?.cost?.total != null ? trace.cost.total.toFixed(6) : "0.000000"}
          </span>
        </div>
      </div>

      {/* Gantt chart */}
      {allEntries.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Timeline
          </div>
          <GanttChart entries={allEntries} highlightNodeId={nodeId} />
        </div>
      )}

      {/* Cost breakdown */}
      {allEntries.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Cost Breakdown
          </div>
          <CostBreakdown entries={allEntries} highlightNodeId={nodeId} />
        </div>
      )}
    </div>
  );
};
