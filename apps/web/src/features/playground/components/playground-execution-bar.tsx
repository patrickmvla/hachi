"use client";

import { useCallback } from "react";
import { Play, Square, LayoutTemplate, Loader2 } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { usePlaygroundStore } from "../store/playground-store";
import { usePlaygroundExecution } from "../hooks/use-playground-execution";

export function PlaygroundExecutionBar() {
  const isRunning = usePlaygroundStore((s) => s.isRunning);
  const testQuery = usePlaygroundStore((s) => s.testQuery);
  const setTestQuery = usePlaygroundStore((s) => s.setTestQuery);
  const setShowTemplatePicker = usePlaygroundStore((s) => s.setShowTemplatePicker);
  const nodes = usePlaygroundStore((s) => s.nodes);
  const { executeWorkflow, stopExecution } = usePlaygroundExecution();

  const handleRun = useCallback(() => {
    if (!testQuery.trim()) return;
    executeWorkflow(testQuery);
  }, [testQuery, executeWorkflow]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  return (
    <div className="border-b border-border bg-background px-4 py-2 flex items-center gap-3">
      <button
        onClick={() => setShowTemplatePicker(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
      >
        <LayoutTemplate size={14} />
        Templates
      </button>

      <div className="h-4 w-px bg-border" />

      <input
        type="text"
        value={testQuery}
        onChange={(e) => setTestQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a test query..."
        className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
        disabled={isRunning}
      />

      {isRunning ? (
        <button
          onClick={stopExecution}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          )}
        >
          <Square size={12} />
          Stop
        </button>
      ) : (
        <button
          onClick={handleRun}
          disabled={!testQuery.trim() || nodes.length === 0}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Play size={12} />
          Run
        </button>
      )}

      {isRunning && (
        <Loader2 size={14} className="animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
