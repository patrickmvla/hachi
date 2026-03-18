"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";

interface ExecutionPromptProps {
  entry: ExecutionLogEntry;
  systemPrompt?: string;
}

export const ExecutionPrompt = ({ entry, systemPrompt }: ExecutionPromptProps) => {
  const input = entry.input as { query?: string; context?: string } | null;

  return (
    <div className="space-y-4 p-4">
      {/* System prompt */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          System Prompt
        </div>
        {systemPrompt ? (
          <pre className="font-mono text-[10px] p-2 bg-muted/30 rounded border border-border whitespace-pre-wrap max-h-40 overflow-auto leading-relaxed">
            {systemPrompt}
          </pre>
        ) : (
          <div className="text-[10px] text-muted-foreground/60 italic p-2 bg-muted/30 rounded border border-border">
            No system prompt configured
          </div>
        )}
      </div>

      {/* User query */}
      {input?.query && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Query
          </div>
          <div className="font-mono text-[10px] p-2 bg-muted/30 rounded border border-border whitespace-pre-wrap">
            {input.query}
          </div>
        </div>
      )}

      {/* Context */}
      {input?.context && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Context
          </div>
          <pre className="font-mono text-[9px] p-2 bg-muted/30 rounded border border-border whitespace-pre-wrap max-h-48 overflow-auto leading-relaxed">
            {input.context}
          </pre>
        </div>
      )}
    </div>
  );
};
