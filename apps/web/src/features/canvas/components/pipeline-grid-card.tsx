import Link from "next/link";
import {
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Timer,
  Coins,
  Hash,
} from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { PipelineViz } from "./pipeline-viz";
import type { Canvas } from "../api/canvas-api";
import { formatRelativeDate } from "@/lib/format-date";

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function formatCost(cost: number) {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function statusBorderColor(status: string | null | undefined): string {
  switch (status) {
    case "completed": return "border-l-green-500";
    case "failed": return "border-l-red-500";
    case "running": return "border-l-blue-500";
    default: return "border-l-border";
  }
}

function getNodeCount(canvas: Canvas) {
  return canvas.graphJson?.nodes?.length || 0;
}

function getGraphNodes(canvas: Canvas) {
  return (canvas.graphJson?.nodes ?? []) as Array<{ id: string; data: { type: string } }>;
}

export function PipelineGridCard({ canvas }: { canvas: Canvas }) {
  const summary = canvas.runSummary;
  const nodeCount = getNodeCount(canvas);
  const graphNodes = getGraphNodes(canvas);
  const successRate = summary && (summary.completed + summary.failed) > 0
    ? Math.round((summary.completed / (summary.completed + summary.failed)) * 100)
    : null;

  return (
    <Link
      href={`/pipelines/${canvas.id}`}
      className={cn(
        "group flex flex-col p-4 rounded-xl border border-border border-l-[3px] bg-card hover:shadow-md transition-all h-full",
        statusBorderColor(summary?.lastRunStatus)
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {canvas.name}
        </h3>
        <button
          className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
          aria-label={`More options for ${canvas.name}`}
          onClick={(e) => e.preventDefault()}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="mb-3">
        <PipelineViz nodes={graphNodes} />
      </div>

      <div className="mt-auto">
        {summary && summary.totalRuns > 0 ? (
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className={cn(
              "font-medium",
              successRate !== null && successRate >= 90 ? "text-green-600" :
              successRate !== null && successRate >= 70 ? "text-yellow-600" : "text-red-500"
            )}>
              <CheckCircle2 size={11} className="inline mr-0.5 -mt-px" />
              {successRate}%
            </span>
            <span className="flex items-center gap-0.5">
              <Hash size={10} />
              {summary.totalRuns}
            </span>
            {summary.avgDurationMs > 0 && (
              <span className="flex items-center gap-0.5">
                <Timer size={10} />
                {formatDuration(summary.avgDurationMs)}
              </span>
            )}
            {summary.totalCost > 0 && (
              <span className="flex items-center gap-0.5">
                <Coins size={10} />
                {formatCost(summary.totalCost)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No runs yet</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formatRelativeDate(canvas.updatedAt)}
        </span>
        <span>{nodeCount} nodes</span>
      </div>
    </Link>
  );
}
