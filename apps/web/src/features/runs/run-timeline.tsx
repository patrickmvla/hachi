"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Step {
  id: string;
  name: string;
  status: "completed" | "pending" | "failed";
  duration: string;
}

interface RunTimelineProps {
  steps: Step[];
}

export const RunTimeline = ({ steps }: RunTimelineProps) => {
  return (
    <div className="relative pl-4 border-l-2 border-[var(--border)] space-y-8 my-4">
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          <div className={`
            absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[var(--background)]
            ${step.status === "completed" ? "border-green-500 text-green-500" :
              step.status === "failed" ? "border-red-500 text-red-500" :
              "border-[var(--muted-foreground)] text-[var(--muted-foreground)]"}
          `}>
            {step.status === "completed" ? <CheckCircle2 size={10} className="fill-current" /> : <Circle size={8} className="fill-current" />}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{step.name}</span>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">{step.duration}</span>
            </div>
            <span className="text-xs text-[var(--muted-foreground)] capitalize">{step.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
