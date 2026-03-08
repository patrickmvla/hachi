"use client";

import { useMemo } from "react";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Loader2,
} from "lucide-react";
import { useRunDetails, useRunEvals } from "./hooks/use-run-queries";
import type { EvalResult } from "./api/runs-api";

interface RunComparisonProps {
  runIdA: string;
  runIdB: string;
}

function MetricDelta({ label, valueA, valueB, format, lowerIsBetter = false }: {
  label: string;
  valueA: number | null;
  valueB: number | null;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}) {
  const a = valueA ?? 0;
  const b = valueB ?? 0;
  const delta = b - a;
  const improved = lowerIsBetter ? delta < 0 : delta > 0;
  const regressed = lowerIsBetter ? delta > 0 : delta < 0;

  return (
    <div className="p-3 rounded-lg border border-border bg-card">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono">{format(a)}</span>
        <span className="text-muted-foreground">vs</span>
        <span className="text-sm font-mono">{format(b)}</span>
        {delta !== 0 && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${
            improved ? "text-green-600" : regressed ? "text-red-600" : "text-muted-foreground"
          }`}>
            {improved ? <ArrowUp size={12} /> : regressed ? <ArrowDown size={12} /> : <Minus size={12} />}
            {format(Math.abs(delta))}
          </span>
        )}
      </div>
    </div>
  );
}

function EvalScoreRow({ metric, evalsA, evalsB }: {
  metric: string;
  evalsA: EvalResult[];
  evalsB: EvalResult[];
}) {
  const scoreA = evalsA.find((e) => e.metric === metric)?.score;
  const scoreB = evalsB.find((e) => e.metric === metric)?.score;

  if (scoreA === undefined && scoreB === undefined) return null;

  const a = scoreA ?? 0;
  const b = scoreB ?? 0;
  const delta = b - a;

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2 font-medium text-sm capitalize">
        {metric.replace("_", " ")}
      </td>
      <td className="px-4 py-2 text-sm font-mono">
        {scoreA !== undefined ? `${(scoreA * 100).toFixed(1)}%` : "—"}
      </td>
      <td className="px-4 py-2 text-sm font-mono">
        {scoreB !== undefined ? `${(scoreB * 100).toFixed(1)}%` : "—"}
      </td>
      <td className="px-4 py-2">
        {scoreA !== undefined && scoreB !== undefined && (
          <span className={`text-xs font-medium ${
            delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"
          }`}>
            {delta > 0 ? "+" : ""}{(delta * 100).toFixed(1)}%
          </span>
        )}
      </td>
    </tr>
  );
}

export function RunComparison({ runIdA, runIdB }: RunComparisonProps) {
  const runA = useRunDetails(runIdA);
  const runB = useRunDetails(runIdB);
  const evalsA = useRunEvals(runIdA);
  const evalsB = useRunEvals(runIdB);

  const isLoading = runA.isLoading || runB.isLoading;

  const allMetrics = useMemo(() => {
    const metrics = new Set<string>();
    evalsA.data?.forEach((e) => metrics.add(e.metric));
    evalsB.data?.forEach((e) => metrics.add(e.metric));
    return Array.from(metrics);
  }, [evalsA.data, evalsB.data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!runA.data || !runB.data) {
    return <div className="text-sm text-red-500">Could not load one or both runs.</div>;
  }

  const a = runA.data.run;
  const b = runB.data.run;

  const durationA = a.startedAt && a.completedAt
    ? new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()
    : null;
  const durationB = b.startedAt && b.completedAt
    ? new Date(b.completedAt).getTime() - new Date(b.startedAt).getTime()
    : null;

  return (
    <div className="space-y-6">
      {/* Run metadata comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricDelta
          label="Duration"
          valueA={durationA}
          valueB={durationB}
          format={(v) => v < 1000 ? `${v}ms` : `${(v / 1000).toFixed(1)}s`}
          lowerIsBetter
        />
        <MetricDelta
          label="Total Tokens"
          valueA={a.totalTokens}
          valueB={b.totalTokens}
          format={(v) => v.toLocaleString()}
          lowerIsBetter
        />
        <MetricDelta
          label="Total Cost"
          valueA={a.totalCost}
          valueB={b.totalCost}
          format={(v) => `$${v.toFixed(4)}`}
          lowerIsBetter
        />
      </div>

      {/* Eval scores comparison */}
      {allMetrics.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Evaluation Scores</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Metric</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Run A {a.isBaseline && "(Baseline)"}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Run B {b.isBaseline && "(Baseline)"}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Delta</th>
                </tr>
              </thead>
              <tbody>
                {allMetrics.map((metric) => (
                  <EvalScoreRow
                    key={metric}
                    metric={metric}
                    evalsA={evalsA.data ?? []}
                    evalsB={evalsB.data ?? []}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step-by-step output comparison */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Step Outputs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1 font-medium">Run A — {a.id.slice(0, 8)}...</div>
            {runA.data.stepOutputs.map((step) => (
              <div key={step.id} className="mb-2 p-3 rounded border border-border bg-card">
                <div className="text-xs font-medium mb-1">{step.nodeId}</div>
                <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 font-medium">Run B — {b.id.slice(0, 8)}...</div>
            {runB.data.stepOutputs.map((step) => (
              <div key={step.id} className="mb-2 p-3 rounded border border-border bg-card">
                <div className="text-xs font-medium mb-1">{step.nodeId}</div>
                <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
