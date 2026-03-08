"use client";

import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Activity, Terminal, Loader2, Star, BarChart3 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useRunDetails, useRunEvals, useSetBaseline } from "@/features/runs/hooks/use-run-queries";
import type { Run, StepOutput } from "@/features/runs/api/runs-api";

export default function RunDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useRunDetails(id);
  const { data: evalResults } = useRunEvals(id, !!data);
  const baselineMutation = useSetBaseline(id);
  const [selectedStep, setSelectedStep] = useState<StepOutput | null>(null);

  // Select the first step once data arrives
  const activeStep = selectedStep ?? data?.stepOutputs[0] ?? null;

  const duration = useMemo(() => {
    if (!data) return "N/A";
    const { run } = data;
    const startTime = run.startedAt ? new Date(run.startedAt) : null;
    const endTime = run.completedAt ? new Date(run.completedAt) : null;

    if (startTime && endTime) {
      const ms = endTime.getTime() - startTime.getTime();
      return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
    }
    if (run.status === "running") return "Running...";
    return "N/A";
  }, [data]);

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: Run["status"]) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
            <CheckCircle2 size={14} />
            Success
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-medium">
            <AlertCircle size={14} />
            Failed
          </div>
        );
      case "running":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
            <Activity size={14} className="animate-pulse" />
            Running
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-500/10 text-gray-600 text-xs font-medium">
            <Clock size={14} />
            Pending
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading run details">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/runs"
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to runs"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Run Details</h1>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 text-red-600 text-sm" role="alert">
          {error?.message || "Run not found"}
        </div>
      </div>
    );
  }

  const { run, stepOutputs } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/runs"
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to runs"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Run {run.id.slice(0, 8)}...
              </h1>
              {getStatusBadge(run.status)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Canvas: {run.canvasId.slice(0, 8)}...</span>
              <span aria-hidden="true">•</span>
              <span>{formatTime(run.startedAt)}</span>
              <span aria-hidden="true">•</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => baselineMutation.mutate()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${
              run.isBaseline
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "border border-border hover:bg-muted"
            }`}
          >
            <Star size={14} className={run.isBaseline ? "fill-current" : ""} />
            {run.isBaseline ? "Baseline" : "Set as Baseline"}
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Rerun
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Execution Steps</h2>
          {stepOutputs.length === 0 ? (
            <div className="p-4 rounded-lg border border-border text-muted-foreground text-sm text-center">
              No step outputs recorded
            </div>
          ) : (
            <div className="relative pl-4 border-l border-border space-y-6" role="list" aria-label="Execution steps">
              {stepOutputs.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`relative pl-6 w-full text-left transition-colors ${
                    activeStep?.id === step.id
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  role="listitem"
                  aria-selected={activeStep?.id === step.id}
                >
                  <div className="absolute left-[-21px] top-0 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center bg-green-500 text-white" aria-hidden="true">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="pt-2">
                    <div className="font-medium">{step.nodeId}</div>
                    <div className="text-xs text-muted-foreground">
                      Completed in {step.latencyMs}ms
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {/* Eval Scores */}
          {evalResults && evalResults.length > 0 && (
            <>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                Evaluation Scores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {evalResults.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-lg border border-border bg-card">
                    <div className="text-xs text-muted-foreground capitalize mb-1">
                      {ev.metric.replace("_", " ")}
                    </div>
                    <div className={`text-2xl font-bold font-mono ${
                      ev.score >= 0.7 ? "text-green-600" :
                      ev.score >= 0.5 ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {(ev.score * 100).toFixed(1)}%
                    </div>
                    {ev.reasoning && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {ev.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="text-lg font-semibold">Step Output</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={16} aria-hidden="true" />
                {activeStep?.nodeId || "No step selected"}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeStep ? `${activeStep.latencyMs}ms` : ""}
              </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto bg-muted/10 max-h-96">
              {activeStep ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(activeStep.output, null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Select a step to view its output
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <h2 className="text-lg font-semibold">Run Input</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={16} aria-hidden="true" />
                Input Data
              </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto bg-muted/10">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(run.input, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
