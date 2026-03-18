"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";
import { Cpu, Coins } from "lucide-react";

interface LlmInspectorProps {
  entry: ExecutionLogEntry;
}

export const LlmInspector = ({ entry }: LlmInspectorProps) => {
  const output = entry.output as Record<string, unknown> | null;
  const trace = entry.trace;
  if (!output) return null;

  const response = (output.response as string) ?? (output.hypotheticalDocuments as string[])?.join("\n---\n") ?? "";
  const model = trace?.model ?? (output.model as string) ?? "";
  const finishReason = trace?.finishReason ?? (output.finishReason as string);
  const tokenCount = trace?.tokenCount;
  const cost = trace?.cost;

  return (
    <div className="space-y-3">
      {/* Model badge & finish reason */}
      <div className="flex items-center gap-2 flex-wrap">
        {model && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-mono">
            <Cpu size={10} />
            {model}
          </span>
        )}
        {finishReason && (
          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px]">
            {finishReason}
          </span>
        )}
      </div>

      {/* Token breakdown */}
      {tokenCount && (tokenCount.prompt || tokenCount.completion) && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Tokens
          </div>
          <div className="flex items-center gap-1 h-4">
            {tokenCount.prompt && tokenCount.completion && (
              <>
                <div
                  className="h-full bg-blue-400 rounded-l-sm"
                  style={{
                    width: `${(tokenCount.prompt / (tokenCount.total ?? tokenCount.prompt + tokenCount.completion)) * 100}%`,
                    minWidth: 4,
                  }}
                  title={`Prompt: ${tokenCount.prompt}`}
                />
                <div
                  className="h-full bg-purple-400 rounded-r-sm"
                  style={{
                    width: `${(tokenCount.completion / (tokenCount.total ?? tokenCount.prompt + tokenCount.completion)) * 100}%`,
                    minWidth: 4,
                  }}
                  title={`Completion: ${tokenCount.completion}`}
                />
              </>
            )}
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>{tokenCount.prompt?.toLocaleString() ?? 0} in</span>
            <span>{tokenCount.completion?.toLocaleString() ?? 0} out</span>
            <span>{tokenCount.total?.toLocaleString() ?? 0} total</span>
          </div>
        </div>
      )}

      {/* Cost breakdown */}
      {cost && cost.total && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Cost
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono bg-muted/30 rounded-md p-2 border border-border">
            <div className="space-y-0.5">
              {cost.input !== undefined && (
                <div className="text-muted-foreground">Input: ${cost.input.toFixed(6)}</div>
              )}
              {cost.output !== undefined && (
                <div className="text-muted-foreground">Output: ${cost.output.toFixed(6)}</div>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Coins size={12} />
              ${cost.total.toFixed(6)}
            </div>
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Response
          </div>
          <div className="text-xs font-mono p-2 bg-muted/30 rounded border border-border whitespace-pre-wrap max-h-48 overflow-auto leading-relaxed">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
