"use client";

import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  ArrowRight,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { StatusBadge } from "@hachi/ui";
import { usePipelineHealth } from "@/features/runs/hooks/use-run-queries";
import { formatRelativeDate } from "@/lib/format-date";

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function formatCost(cost: number) {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function MiniBarChart({ data }: { data: { completed: number; failed: number }[] }) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => Number(d.completed) + Number(d.failed)), 1);

  return (
    <div className="flex items-end gap-[3px] h-10">
      {data.map((day, i) => {
        const completed = Number(day.completed);
        const failed = Number(day.failed);
        const total = completed + failed;
        const height = Math.max((total / maxVal) * 100, 4);
        const failRatio = total > 0 ? failed / total : 0;

        return (
          <div
            key={i}
            className="flex-1 min-w-[4px] max-w-[12px] rounded-sm transition-all"
            style={{
              height: `${height}%`,
              background:
                failRatio > 0.5
                  ? "hsl(var(--destructive))"
                  : failRatio > 0
                    ? "hsl(var(--warning, 38 92% 50%))"
                    : total > 0
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
              opacity: total === 0 ? 0.3 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

function HealthContent({ health }: { health: NonNullable<ReturnType<typeof usePipelineHealth>["data"]> }) {
  const { totals, totalCost, avgDurationMs, successRate, recentRuns, dailyRuns } = health;
  const totalRuns = totals.completed + totals.failed + totals.running + totals.pending;

  if (totalRuns === 0 && recentRuns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <Zap size={20} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No runs in the last 7 days. Execute a canvas to see metrics here.
        </p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Success Rate",
      value: `${(successRate * 100).toFixed(0)}%`,
      icon: CheckCircle2,
      color: successRate >= 0.9 ? "text-green-500" : successRate >= 0.7 ? "text-yellow-500" : "text-red-500",
      bgColor: successRate >= 0.9 ? "bg-green-500/10" : successRate >= 0.7 ? "bg-yellow-500/10" : "bg-red-500/10",
    },
    {
      label: "Completed",
      value: totals.completed,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Failed",
      value: totals.failed,
      icon: XCircle,
      color: totals.failed > 0 ? "text-red-500" : "text-muted-foreground",
      bgColor: totals.failed > 0 ? "bg-red-500/10" : "bg-muted/50",
    },
    {
      label: "Avg Duration",
      value: formatDuration(avgDurationMs),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
          >
            <div className={cn("p-2 rounded-lg", m.bgColor)}>
              <m.icon size={16} className={m.color} />
            </div>
            <div>
              <p className={cn("text-lg font-bold leading-none", m.color)}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Daily Activity</p>
            {totalCost > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Coins size={12} />
                {formatCost(totalCost)} total
              </div>
            )}
          </div>
          <MiniBarChart data={dailyRuns} />
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl border border-border bg-card divide-y divide-border">
          <div className="px-4 py-2.5">
            <p className="text-sm font-medium text-muted-foreground">Recent Runs</p>
          </div>
          {recentRuns.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No runs yet
            </div>
          ) : (
            recentRuns.map((run) => (
              <Link
                key={run.id}
                href={`/runs/${run.id}`}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusBadge
                    status={run.status === "completed" ? "completed" : run.status === "failed" ? "failed" : run.status === "running" ? "running" : "pending"}
                  />
                  <span className="text-sm font-medium truncate">
                    {run.canvasName}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                  {run.durationMs != null && (
                    <span className="hidden sm:inline">{formatDuration(run.durationMs)}</span>
                  )}
                  {run.totalCost != null && run.totalCost > 0 && (
                    <span className="hidden md:inline">{formatCost(run.totalCost)}</span>
                  )}
                  <span className="w-16 text-right">
                    {run.startedAt ? formatRelativeDate(run.startedAt) : "—"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export function PipelineHealth() {
  const { data: health, isLoading, isError } = usePipelineHealth(7);

  return (
    <div className="space-y-4">
      {/* Header always renders immediately — no layout shift */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Pipeline Health
          <span className="text-xs font-normal text-muted-foreground">Last 7 days</span>
        </h2>
        <Link href="/runs" className="text-sm text-primary hover:underline flex items-center gap-1">
          All runs <ArrowRight size={14} />
        </Link>
      </div>

      {/* Content loads below the fixed header */}
      {isLoading ? (
        <div className="rounded-xl border border-dashed border-border p-6 flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading health data...</p>
        </div>
      ) : isError || !health ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <Zap size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Unable to load pipeline health data.
          </p>
        </div>
      ) : (
        <HealthContent health={health} />
      )}
    </div>
  );
}
