"use client";

import { Play, Square, Loader2, LayoutTemplate, Coins, Zap } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { useExecution } from "../hooks/use-execution";

interface ExecutionBarProps {
  canvasId: string;
  onOpenTemplatePicker?: () => void;
}

export const ExecutionBar = ({ canvasId, onOpenTemplatePicker }: ExecutionBarProps) => {
  const { isRunning } = useCanvasStore();
  const { currentNodeId, entries, runTrace } = useExecutionLogStore();
  const { executeWorkflow, stopExecution } = useExecution(canvasId);

  const handleRun = () => {
    executeWorkflow("");
  };

  // Find current step name from entries
  const currentEntry = entries.find((e) => e.nodeId === currentNodeId);
  const currentStepName = currentEntry?.stepName;

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${isRunning
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            `}
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                Run Workflow
              </>
            )}
          </button>

          {isRunning && (
            <button
              onClick={stopExecution}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              aria-label="Stop workflow"
            >
              <Square size={16} className="fill-current" />
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        {onOpenTemplatePicker && (
          <>
            <button
              onClick={onOpenTemplatePicker}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <LayoutTemplate size={16} />
              Templates
            </button>
            <div className="h-6 w-px bg-border" aria-hidden="true" />
          </>
        )}

      </div>

      <div className="flex items-center gap-4">
        {/* Run summary after completion */}
        {runTrace && !isRunning && (
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1" title="Total latency">
              <Zap size={11} />
              {runTrace.totalLatencyMs}ms
            </span>
            {runTrace.totalTokens > 0 && (
              <span title="Total tokens">
                {runTrace.totalTokens.toLocaleString()} tok
              </span>
            )}
            {runTrace.totalCost > 0 && (
              <span className="flex items-center gap-0.5" title="Total cost">
                <Coins size={11} />
                ${runTrace.totalCost.toFixed(4)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
          {isRunning && currentStepName ? (
            <>
              <Loader2 size={12} className="animate-spin text-blue-500" />
              <span className="text-blue-600 font-medium">{currentStepName}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
              Ready
            </>
          )}
        </div>
      </div>
    </div>
  );
};
