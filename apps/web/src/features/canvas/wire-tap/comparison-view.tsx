"use client";

import { ArrowRight } from "lucide-react";

interface ComparisonViewProps {
  runA: { id: string; output: string };
  runB: { id: string; output: string };
}

export const ComparisonView = ({ runA, runB }: ComparisonViewProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full" role="region" aria-label="Run comparison">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Run {runA.id}</span>
        </div>
        <div className="flex-1 p-4 rounded-lg border border-border bg-muted/10 text-sm font-mono overflow-auto">
          {runA.output}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Run {runB.id}</span>
        </div>
        <div className="flex-1 p-4 rounded-lg border border-border bg-muted/10 text-sm font-mono overflow-auto">
          {runB.output}
        </div>
      </div>
    </div>
  );
};
