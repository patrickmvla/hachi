"use client";

import { CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";

interface Run {
  id: string;
  name: string;
  status: "success" | "failed" | "running";
  duration: string;
  createdAt: string;
  tokens: number;
}

interface RunCardProps {
  run: Run;
}

export const RunCard = ({ run }: RunCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`
          p-2 rounded-full
          ${run.status === "success" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
            run.status === "failed" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}
        `}>
          {run.status === "success" ? <CheckCircle2 size={20} /> :
           run.status === "failed" ? <XCircle size={20} /> :
           <Clock size={20} className="animate-pulse" />}
        </div>

        <div>
          <h3 className="font-medium text-sm">{run.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
            <span className="font-mono">{run.id}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {run.createdAt}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-right">
          <div className="font-medium">{run.duration}</div>
          <div className="text-xs text-[var(--muted-foreground)]">Duration</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{run.tokens}</div>
          <div className="text-xs text-[var(--muted-foreground)]">Tokens</div>
        </div>
      </div>
    </div>
  );
};
