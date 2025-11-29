"use client";

import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Activity, Terminal, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { runsApi, type Run, type StepOutput } from "@/lib/api";

interface RunDetails {
  run: Run;
  stepOutputs: StepOutput[];
  duration?: string;
}

export default function RunDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [runDetails, setRunDetails] = useState<RunDetails | null>(null);
  const [selectedStep, setSelectedStep] = useState<StepOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRunDetails();
  }, [id]);

  const loadRunDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await runsApi.get(id);

      if (result.error || !result.data) {
        setError(result.error || "Failed to load run details");
        return;
      }

      const { run, stepOutputs } = result.data;

      // Calculate duration
      const startTime = run.startedAt ? new Date(run.startedAt) : null;
      const endTime = run.completedAt ? new Date(run.completedAt) : null;
      let duration = "N/A";

      if (startTime && endTime) {
        const ms = endTime.getTime() - startTime.getTime();
        duration = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
      } else if (run.status === "running") {
        duration = "Running...";
      }

      setRunDetails({ run, stepOutputs, duration });

      // Select first step by default
      if (stepOutputs.length > 0) {
        setSelectedStep(stepOutputs[0]!);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load run details");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (error || !runDetails) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/runs"
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Run Details</h1>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 text-red-600 text-sm">
          {error || "Run not found"}
        </div>
      </div>
    );
  }

  const { run, stepOutputs, duration } = runDetails;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/runs"
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Run {run.id.slice(0, 8)}...
              </h1>
              {getStatusBadge(run.status)}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-1">
              <span>Canvas: {run.canvasId.slice(0, 8)}...</span>
              <span>•</span>
              <span>{formatTime(run.startedAt)}</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm">
          Rerun
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Execution Steps</h2>
          {stepOutputs.length === 0 ? (
            <div className="p-4 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] text-sm text-center">
              No step outputs recorded
            </div>
          ) : (
            <div className="relative pl-4 border-l border-[var(--border)] space-y-6">
              {stepOutputs.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`relative pl-6 w-full text-left transition-colors ${
                    selectedStep?.id === step.id
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="absolute left-[-21px] top-0 w-10 h-10 rounded-full border-4 border-[var(--background)] flex items-center justify-center bg-green-500 text-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="pt-2">
                    <div className="font-medium">{step.nodeId}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      Completed in {step.latencyMs}ms
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Step Output</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/30">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={16} />
                {selectedStep?.nodeId || "No step selected"}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {selectedStep ? `${selectedStep.latencyMs}ms` : ""}
              </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto bg-[var(--muted)]/10 max-h-96">
              {selectedStep ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedStep.output, null, 2)}
                </pre>
              ) : (
                <div className="text-[var(--muted-foreground)] text-center py-8">
                  Select a step to view its output
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <h2 className="text-lg font-semibold">Run Input</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/30">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={16} />
                Input Data
              </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto bg-[var(--muted)]/10">
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
