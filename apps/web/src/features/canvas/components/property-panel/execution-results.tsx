"use client";

import { useExecutionLogStore, type ExecutionLogEntry } from "@/stores/execution-log-store";
import { JsonViewer } from "../../wire-tap/json-viewer";
import { DocumentResults } from "./document-results";
import { LlmInspector } from "./llm-inspector";
import { JudgeInspector } from "./judge-inspector";

interface ExecutionResultsProps {
  nodeId: string;
  nodeType: string;
}

/** Maps frontend node types to the specialized inspector to use */
const INSPECTOR_MAP: Record<string, "llm" | "documents" | "judge"> = {
  llm: "llm",
  generate: "llm",
  hyde: "llm",
  agent: "llm",
  retriever: "documents",
  retrieve: "documents",
  reranker: "documents",
  rerank: "documents",
  judge: "judge",
};

export const ExecutionResults = ({ nodeId, nodeType }: ExecutionResultsProps) => {
  const entries = useExecutionLogStore((s) => s.entries);
  const entry = entries.find((e) => e.nodeId === nodeId && e.status !== "running");

  if (!entry) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
        No execution data yet. Run the pipeline first.
      </div>
    );
  }

  const inspectorType = INSPECTOR_MAP[nodeType];

  return (
    <div className="space-y-4">
      {/* Specialized inspector */}
      {inspectorType === "llm" && <LlmInspector entry={entry} />}
      {inspectorType === "documents" && <DocumentResults entry={entry} />}
      {inspectorType === "judge" && <JudgeInspector entry={entry} />}

      {/* Input section */}
      {entry.input && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Input
          </div>
          <JsonViewer data={entry.input} />
        </div>
      )}

      {/* Output section (if no specialized view or as fallback) */}
      {!inspectorType && entry.output && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Output
          </div>
          <JsonViewer data={entry.output} />
        </div>
      )}

      {/* Trace summary */}
      {entry.trace && (
        <div className="space-y-1 text-[10px]">
          <div className="font-semibold text-muted-foreground uppercase tracking-wider">
            Trace
          </div>
          <div className="grid grid-cols-2 gap-1 bg-muted/30 rounded-md p-2 border border-border">
            {entry.trace.model && (
              <>
                <span className="text-muted-foreground">Model</span>
                <span className="font-mono">{entry.trace.model}</span>
              </>
            )}
            {entry.latencyMs > 0 && (
              <>
                <span className="text-muted-foreground">Latency</span>
                <span className="font-mono">{entry.latencyMs}ms</span>
              </>
            )}
            {entry.trace.tokenCount?.total && (
              <>
                <span className="text-muted-foreground">Tokens</span>
                <span className="font-mono">{entry.trace.tokenCount.total.toLocaleString()}</span>
              </>
            )}
            {entry.trace.cost?.total && (
              <>
                <span className="text-muted-foreground">Cost</span>
                <span className="font-mono text-amber-600">${entry.trace.cost.total.toFixed(6)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
