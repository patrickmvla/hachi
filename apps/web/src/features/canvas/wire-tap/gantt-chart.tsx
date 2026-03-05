"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hachi/ui/components/tooltip";

interface GanttChartProps {
  entries: ExecutionLogEntry[];
}

const NODE_TYPE_COLORS: Record<string, string> = {
  query: "#3b82f6",
  embed: "#ec4899",
  embedding: "#ec4899",
  retrieve: "#f97316",
  retriever: "#f97316",
  rerank: "#eab308",
  reranker: "#eab308",
  judge: "#ef4444",
  generate: "#a855f7",
  llm: "#a855f7",
  hyde: "#06b6d4",
  agent: "#22c55e",
};

export const GanttChart = ({ entries }: GanttChartProps) => {
  if (entries.length === 0) return null;

  const firstTimestamp = Math.min(...entries.map((e) => e.timestamp));
  const maxEnd = Math.max(...entries.map((e) => e.timestamp + e.latencyMs));
  const totalDuration = maxEnd - firstTimestamp;

  if (totalDuration === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-1">
        {entries.map((entry) => {
          const start = entry.timestamp - firstTimestamp;
          const startPct = (start / totalDuration) * 100;
          const widthPct = Math.max((entry.latencyMs / totalDuration) * 100, 1);
          const color = NODE_TYPE_COLORS[entry.nodeType] ?? "#6b7280";

          return (
            <Tooltip key={entry.id}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 h-6">
                  <span className="text-[9px] font-mono text-muted-foreground w-16 truncate text-right shrink-0">
                    {entry.nodeName}
                  </span>
                  <div className="flex-1 h-4 bg-muted/30 rounded-sm relative overflow-hidden">
                    <div
                      className="absolute h-full rounded-sm transition-all"
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: color,
                        opacity: entry.status === "error" ? 0.5 : 0.8,
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground w-12 text-right shrink-0">
                    {entry.latencyMs}ms
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                <div className="space-y-0.5">
                  <div className="font-semibold">{entry.nodeName}</div>
                  <div>Duration: {entry.latencyMs}ms</div>
                  {entry.trace?.tokenCount?.total && (
                    <div>Tokens: {entry.trace.tokenCount.total.toLocaleString()}</div>
                  )}
                  {entry.trace?.cost?.total && (
                    <div>Cost: ${entry.trace.cost.total.toFixed(6)}</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Time axis */}
        <div className="flex items-center gap-2 mt-1">
          <span className="w-16 shrink-0" />
          <div className="flex-1 flex justify-between text-[8px] text-muted-foreground font-mono">
            <span>0ms</span>
            <span>{Math.round(totalDuration / 2)}ms</span>
            <span>{Math.round(totalDuration)}ms</span>
          </div>
          <span className="w-12 shrink-0" />
        </div>
      </div>
    </TooltipProvider>
  );
};
