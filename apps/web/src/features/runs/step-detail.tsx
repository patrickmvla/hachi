"use client";

import { Code, FileText, Activity } from "lucide-react";

interface StepDetailProps {
  step: {
    id: string;
    name: string;
    input: unknown;
    output: unknown;
    logs: string[];
  };
}

export const StepDetail = ({ step }: StepDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Activity size={18} className="text-primary" aria-hidden="true" />
        <h2 className="font-semibold">{step.name} Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Code size={14} aria-hidden="true" />
            Input
          </div>
          <pre className="p-4 rounded-lg bg-muted/30 text-xs font-mono overflow-auto max-h-[300px]">
            {JSON.stringify(step.input, null, 2)}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText size={14} aria-hidden="true" />
            Output
          </div>
          <pre className="p-4 rounded-lg bg-muted/30 text-xs font-mono overflow-auto max-h-[300px]">
            {JSON.stringify(step.output, null, 2)}
          </pre>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Logs</div>
        <div className="p-4 rounded-lg bg-black text-green-400 font-mono text-xs space-y-1" role="log">
          {step.logs.map((log, i) => (
            <div key={i}>{`> ${log}`}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
