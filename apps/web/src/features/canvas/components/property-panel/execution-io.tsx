"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";
import { JsonViewer } from "../../wire-tap/json-viewer";

interface ExecutionIOProps {
  entry: ExecutionLogEntry;
}

export const ExecutionIO = ({ entry }: ExecutionIOProps) => {
  return (
    <div className="space-y-4 p-4">
      {entry.input && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Input
          </div>
          <JsonViewer data={entry.input} />
        </div>
      )}

      {entry.output && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Output
          </div>
          <JsonViewer data={entry.output} />
        </div>
      )}

      {entry.logMessages.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Logs
          </div>
          <div className="space-y-0.5 max-h-48 overflow-auto">
            {entry.logMessages.map((msg, i) => (
              <div
                key={i}
                className="text-[10px] font-mono text-muted-foreground py-0.5 px-2 bg-muted/30 rounded"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
