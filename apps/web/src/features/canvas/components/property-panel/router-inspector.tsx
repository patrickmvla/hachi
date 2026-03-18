"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";

interface RouterInspectorProps {
  entry: ExecutionLogEntry;
}

export const RouterInspector = ({ entry }: RouterInspectorProps) => {
  const output = entry.output as Record<string, unknown> | null;
  if (!output) return null;

  const selectedBranch = output.selectedBranch as number | undefined;
  const totalBranches = output.totalBranches as number | undefined;
  const confidence = output.confidence as number | undefined;
  const strategy = output.strategy as string | undefined;
  const reasoning = output.reasoning as string | undefined;

  return (
    <div className="space-y-3">
      {/* Branch & strategy badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {selectedBranch != null && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
            Branch {selectedBranch}{totalBranches != null ? ` / ${totalBranches}` : ""}
          </span>
        )}
        {strategy && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground capitalize">
            {strategy}
          </span>
        )}
      </div>

      {/* Confidence bar */}
      {confidence != null && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Confidence
          </div>
          <div className="h-4 w-full bg-muted rounded-sm overflow-hidden">
            <div
              className="h-full bg-cyan-500/70 rounded-sm transition-all"
              style={{ width: `${Math.min(confidence * 100, 100)}%` }}
              title={`Confidence: ${(confidence * 100).toFixed(1)}%`}
            />
          </div>
          <div className="text-[9px] font-mono text-muted-foreground text-right">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}

      {/* Reasoning */}
      {reasoning && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Reasoning
          </div>
          <div className="text-[10px] font-mono p-2 bg-muted/30 rounded border border-border whitespace-pre-wrap max-h-40 overflow-auto leading-relaxed">
            {reasoning}
          </div>
        </div>
      )}
    </div>
  );
};
