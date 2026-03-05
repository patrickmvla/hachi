"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";
import { FileText } from "lucide-react";

interface DocumentResultsProps {
  entry: ExecutionLogEntry;
}

interface DocItem {
  id?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  score?: number;
  rerankScore?: number;
}

export const DocumentResults = ({ entry }: DocumentResultsProps) => {
  const output = entry.output as Record<string, unknown> | null;
  if (!output) return null;

  const documents = (output.documents as DocItem[]) ?? [];
  const totalFound = (output.totalFound as number) ?? documents.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Documents
        </div>
        <span className="text-[10px] text-muted-foreground">
          {documents.length} returned / {totalFound} found
        </span>
      </div>

      {/* Score chart */}
      {documents.length > 0 && (
        <div className="space-y-1">
          {documents.map((doc, i) => {
            const score = doc.rerankScore ?? doc.score ?? 0;
            const pct = Math.min(score * 100, 100);
            return (
              <div key={doc.id ?? i} className="flex items-center gap-2">
                <FileText size={10} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 w-full bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-orange-500/70 rounded-sm transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground w-10 text-right shrink-0">
                  {score.toFixed(3)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Document list */}
      <div className="space-y-2">
        {documents.map((doc, i) => (
          <div
            key={doc.id ?? i}
            className="p-2 rounded border border-border bg-muted/20 text-[10px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium truncate">
                {(doc.metadata?.title as string) ?? doc.id ?? `Document ${i + 1}`}
              </span>
              <span className="font-mono text-muted-foreground">
                {(doc.rerankScore ?? doc.score ?? 0).toFixed(3)}
              </span>
            </div>
            {doc.content && (
              <p className="text-muted-foreground line-clamp-2 font-mono leading-relaxed">
                {doc.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
