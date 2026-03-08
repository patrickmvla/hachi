"use client";

import { ArrowUp, ArrowDown, Minus, Loader2, AlertTriangle } from "lucide-react";
import {
  useBatchResults,
  useEvalThresholds,
} from "./hooks/use-evaluation-queries";
import type { EvalAggregate } from "./api/evaluation-api";

interface VariantComparisonProps {
  baselineBatchId: string;
  variantBatchId: string;
  canvasId: string;
}

function AggregateCard({ label, baseline, variant, threshold }: {
  label: string;
  baseline: EvalAggregate;
  variant: EvalAggregate;
  threshold?: number;
}) {
  const delta = variant.mean - baseline.mean;
  const regressed = threshold !== undefined && variant.mean < threshold;

  return (
    <div className={`p-4 rounded-lg border bg-card ${
      regressed ? "border-red-300 dark:border-red-800" : "border-border"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium capitalize">{label.replace("_", " ")}</span>
        {regressed && (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle size={12} />
            Below threshold
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Mean</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-mono">{(baseline.mean * 100).toFixed(1)}%</span>
            <span className="text-muted-foreground text-xs">vs</span>
            <span className="text-sm font-mono">{(variant.mean * 100).toFixed(1)}%</span>
            <span className={`text-[10px] font-medium ${
              delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"
            }`}>
              {delta > 0 ? <ArrowUp size={10} /> : delta < 0 ? <ArrowDown size={10} /> : <Minus size={10} />}
            </span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">P50</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-mono">{(baseline.p50 * 100).toFixed(1)}%</span>
            <span className="text-muted-foreground text-xs">vs</span>
            <span className="text-sm font-mono">{(variant.p50 * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">P90</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-mono">{(baseline.p90 * 100).toFixed(1)}%</span>
            <span className="text-muted-foreground text-xs">vs</span>
            <span className="text-sm font-mono">{(variant.p90 * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {threshold !== undefined && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
          Threshold: {(threshold * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

export function VariantComparison({ baselineBatchId, variantBatchId, canvasId }: VariantComparisonProps) {
  const baselineQuery = useBatchResults(baselineBatchId);
  const variantQuery = useBatchResults(variantBatchId);
  const thresholdsQuery = useEvalThresholds(canvasId);

  const isLoading = baselineQuery.isLoading || variantQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!baselineQuery.data || !variantQuery.data) {
    return <div className="text-sm text-red-500">Could not load batch results.</div>;
  }

  const baselineAgg = baselineQuery.data.aggregates;
  const variantAgg = variantQuery.data.aggregates;
  const thresholdMap = new Map(
    (thresholdsQuery.data ?? []).map((t) => [t.metric, t.threshold])
  );

  const allMetrics = Array.from(
    new Set([...Object.keys(baselineAgg), ...Object.keys(variantAgg)])
  );

  const regressions = allMetrics.filter((metric) => {
    const threshold = thresholdMap.get(metric);
    if (threshold === undefined) return false;
    const variantMean = variantAgg[metric]?.mean ?? 0;
    return variantMean < threshold;
  });

  return (
    <div className="space-y-4">
      {regressions.length > 0 && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
            <AlertTriangle size={16} />
            {regressions.length} metric{regressions.length > 1 ? "s" : ""} regressed below threshold
          </div>
          <ul className="mt-1 text-xs text-red-600 dark:text-red-400">
            {regressions.map((m) => (
              <li key={m} className="capitalize">
                {m.replace("_", " ")}: {((variantAgg[m]?.mean ?? 0) * 100).toFixed(1)}% &lt; {((thresholdMap.get(m) ?? 0) * 100).toFixed(0)}% threshold
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allMetrics.map((metric) => {
          const baseline = baselineAgg[metric] ?? { mean: 0, p50: 0, p90: 0, count: 0 };
          const variant = variantAgg[metric] ?? { mean: 0, p50: 0, p90: 0, count: 0 };
          return (
            <AggregateCard
              key={metric}
              label={metric}
              baseline={baseline}
              variant={variant}
              threshold={thresholdMap.get(metric)}
            />
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">
        Baseline: {baselineQuery.data.runs.length} runs | Variant: {variantQuery.data.runs.length} runs
      </div>
    </div>
  );
}
