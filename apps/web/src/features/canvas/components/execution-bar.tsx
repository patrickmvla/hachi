"use client";

import { Play, Square, Loader2 } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";

import { TemplateLoader } from "./template-loader";

export const ExecutionBar = () => {
  const { isRunning, setIsRunning } = useCanvasStore();

  const handleRun = () => {
    setIsRunning(true);
    // Mock execution delay
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

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
              onClick={() => setIsRunning(false)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              aria-label="Stop workflow"
            >
              <Square size={16} className="fill-current" />
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <TemplateLoader />

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
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
          <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
          Ready
        </div>
      </div>
    </div>
  );
};
