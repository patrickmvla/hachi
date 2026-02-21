"use client";

import { Play, Square, Loader2, LayoutTemplate } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { useMockExecution } from "../hooks/use-mock-execution";

interface ExecutionBarProps {
  onOpenTemplatePicker?: () => void;
}

export const ExecutionBar = ({ onOpenTemplatePicker }: ExecutionBarProps) => {
  const { isRunning } = useCanvasStore();
  const { testQuery, setTestQuery, currentNodeId, entries } = useExecutionLogStore();
  const { executeWorkflow, stopExecution } = useMockExecution();

  const handleRun = () => {
    executeWorkflow(testQuery || "What is retrieval augmented generation?");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isRunning) handleRun();
    }
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

        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter test query..."
            className="w-full pl-4 pr-12 py-2 text-sm rounded-md border border-border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
            aria-label="Test query input"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded" aria-hidden="true">
            ⌘ + Enter
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
