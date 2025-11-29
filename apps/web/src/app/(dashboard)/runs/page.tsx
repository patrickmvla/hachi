"use client";

import Link from "next/link";
import { Activity, CheckCircle2, AlertCircle, Clock, Filter, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { runsApi, canvasesApi, type Run, type Canvas } from "@/lib/api";

// TODO: Get from context or URL params
const CANVAS_ID = "00000000-0000-0000-0000-000000000000";

interface RunWithCanvas extends Run {
  canvasName?: string;
  duration?: string;
  cost?: string;
}

export default function RunsPage() {
  const [runs, setRuns] = useState<RunWithCanvas[]>([]);
  const [canvases, setCanvases] = useState<Map<string, Canvas>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load runs for all canvases
      // In a real app, we'd load runs for the current workspace
      const result = await runsApi.list(CANVAS_ID);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Calculate duration and format runs
      const formattedRuns: RunWithCanvas[] = (result.data?.runs || []).map((run) => {
        const startTime = run.startedAt ? new Date(run.startedAt) : null;
        const endTime = run.completedAt ? new Date(run.completedAt) : null;
        let duration = "N/A";

        if (startTime && endTime) {
          const ms = endTime.getTime() - startTime.getTime();
          duration = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
        } else if (run.status === "running" && startTime) {
          duration = "Running...";
        }

        return {
          ...run,
          duration,
          cost: "$0.00", // TODO: Calculate from token usage
        };
      });

      setRuns(formattedRuns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load runs");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: Run["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "failed":
        return "bg-red-500/10 text-red-600";
      case "running":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getStatusIcon = (status: Run["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={14} />;
      case "failed":
        return <AlertCircle size={14} />;
      case "running":
        return <Activity size={14} className="animate-pulse" />;
      default:
        return <Clock size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Runs History</h1>
          <p className="text-[var(--muted-foreground)]">View and debug your past executions.</p>
        </div>
        <button
          onClick={loadRuns}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
        >
          <Activity size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter Status
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium">
            <Clock size={16} />
            Time Range
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Canvas</th>
                <th className="px-6 py-3">Run ID</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Cost</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    <div className="flex flex-col items-center gap-2">
                      <Activity size={32} className="opacity-20" />
                      <p>No runs found</p>
                      <p className="text-xs">Execute a canvas to see run history</p>
                    </div>
                  </td>
                </tr>
              ) : (
                runs.map((run) => (
                  <tr key={run.id} className="group hover:bg-[var(--muted)]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getStatusColor(run.status)} text-xs font-medium w-fit`}>
                        {getStatusIcon(run.status)}
                        {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {run.canvasName || run.canvasId.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)] font-mono text-xs">
                      {run.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {run.duration}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {run.cost}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {formatTime(run.startedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/runs/${run.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
