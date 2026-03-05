"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";

interface JudgeInspectorProps {
  entry: ExecutionLogEntry;
}

const ASSESSMENT_COLORS: Record<string, string> = {
  sufficient: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  insufficient: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ambiguous: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const RECOMMENDATION_COLORS: Record<string, string> = {
  proceed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  refine_query: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  web_search: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  fallback: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const JudgeInspector = ({ entry }: JudgeInspectorProps) => {
  const output = entry.output as Record<string, unknown> | null;
  if (!output) return null;

  const assessment = output.overallAssessment as string | undefined;
  const recommendation = output.recommendation as string | undefined;
  const reasoning = output.reasoning as string | undefined;
  const relevantDocs = output.relevantDocuments as unknown[] | undefined;
  const irrelevantDocs = output.irrelevantDocuments as unknown[] | undefined;
  const relevantCount = relevantDocs?.length ?? 0;
  const irrelevantCount = irrelevantDocs?.length ?? 0;
  const total = relevantCount + irrelevantCount;

  return (
    <div className="space-y-3">
      {/* Assessment & recommendation badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {assessment && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${ASSESSMENT_COLORS[assessment] ?? "bg-muted text-muted-foreground"}`}>
            {assessment}
          </span>
        )}
        {recommendation && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${RECOMMENDATION_COLORS[recommendation] ?? "bg-muted text-muted-foreground"}`}>
            {recommendation.replace(/_/g, " ")}
          </span>
        )}
      </div>

      {/* Document relevance bar */}
      {total > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Relevance
          </div>
          <div className="flex items-center gap-1 h-4 rounded-sm overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(relevantCount / total) * 100}%`, minWidth: relevantCount > 0 ? 4 : 0 }}
              title={`Relevant: ${relevantCount}`}
            />
            <div
              className="h-full bg-red-400"
              style={{ width: `${(irrelevantCount / total) * 100}%`, minWidth: irrelevantCount > 0 ? 4 : 0 }}
              title={`Irrelevant: ${irrelevantCount}`}
            />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>{relevantCount} relevant</span>
            <span>{irrelevantCount} irrelevant</span>
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
