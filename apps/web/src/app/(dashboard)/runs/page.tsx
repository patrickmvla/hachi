"use client";

import Link from "next/link";
import { Activity, CheckCircle2, AlertCircle, Clock, Filter, ArrowRight, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useRunsList } from "@/features/runs/hooks/use-run-queries";
import type { Run } from "@/features/runs/api/runs-api";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  StatusBadge,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@hachi/ui";

// TODO: Get from context or URL params
const CANVAS_ID = "00000000-0000-0000-0000-000000000000";

interface RunWithMeta extends Run {
  duration: string;
  cost: string;
}

export default function RunsPage() {
  const { data: rawRuns = [], isLoading, error, refetch } = useRunsList(CANVAS_ID);

  const runs: RunWithMeta[] = useMemo(() => {
    return rawRuns.map((run) => {
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
  }, [rawRuns]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading runs">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Runs History</PageHeaderTitle>
          <PageHeaderDescription>View and debug your past executions.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
          >
            <Activity size={16} aria-hidden="true" />
            Refresh
          </button>
        </PageHeaderActions>
      </PageHeader>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm" role="alert">
          {error.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter Status
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium">
            <Clock size={16} />
            Time Range
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
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
            <tbody className="divide-y divide-border">
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <Empty className="border-0">
                      <EmptyMedia variant="icon">
                        <Activity size={24} />
                      </EmptyMedia>
                      <EmptyHeader>
                        <EmptyTitle>No runs found</EmptyTitle>
                        <EmptyDescription>Execute a canvas to see run history</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </td>
                </tr>
              ) : (
                runs.map((run) => (
                  <tr key={run.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {run.canvasId.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {run.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {run.duration}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {run.cost}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatTime(run.startedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/runs/${run.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
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
