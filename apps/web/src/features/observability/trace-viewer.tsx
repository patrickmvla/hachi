"use client";

import { useState } from "react";
import { BarChart3, AlertTriangle, Coins, Clock } from "lucide-react";
import { useLatencyStats, useErrorStats, useCostStats } from "./hooks/use-observability-queries";

interface TraceViewerProps {
  canvasId: string;
}

type TabType = "latency" | "errors" | "costs";

export const TraceViewer = ({ canvasId }: TraceViewerProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("latency");
  const [days, setDays] = useState(7);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-black/[0.06] px-3 shrink-0">
        <div className="flex" role="tablist">
          {([
            { key: "latency" as const, icon: Clock, label: "Latency" },
            { key: "errors" as const, icon: AlertTriangle, label: "Errors" },
            { key: "costs" as const, icon: Coins, label: "Costs" },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-black text-black"
                  : "border-transparent text-black/35 hover:text-black/60"
              }`}
              role="tab"
              aria-selected={activeTab === key}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="text-[10px] border border-black/10 rounded px-1.5 py-0.5 bg-white"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "latency" && <LatencyTab canvasId={canvasId} days={days} />}
        {activeTab === "errors" && <ErrorsTab canvasId={canvasId} days={days} />}
        {activeTab === "costs" && <CostsTab canvasId={canvasId} days={days} />}
      </div>
    </div>
  );
};

function LatencyTab({ canvasId, days }: { canvasId: string; days: number }) {
  const { data, isLoading } = useLatencyStats(canvasId, days);

  if (isLoading) return <LoadingState />;
  if (!data || Object.keys(data).length === 0) return <EmptyState message="No latency data yet" />;

  const entries = Object.entries(data).sort((a, b) => b[1].p50 - a[1].p50);
  const maxP99 = Math.max(...entries.map(([, v]) => v.p99));

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider mb-3">
        Latency by Node Type (ms)
      </div>
      {entries.map(([nodeType, stats]) => (
        <div key={nodeType} className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-black/70">{nodeType}</span>
            <span className="text-[10px] text-black/40 font-mono">{stats.count} samples</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-4 bg-black/[0.03] rounded-md overflow-hidden relative">
              {/* p99 bar */}
              <div
                className="absolute inset-y-0 left-0 bg-red-100 rounded-md"
                style={{ width: `${(stats.p99 / maxP99) * 100}%` }}
              />
              {/* p90 bar */}
              <div
                className="absolute inset-y-0 left-0 bg-amber-200 rounded-md"
                style={{ width: `${(stats.p90 / maxP99) * 100}%` }}
              />
              {/* p50 bar */}
              <div
                className="absolute inset-y-0 left-0 bg-green-300 rounded-md"
                style={{ width: `${(stats.p50 / maxP99) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3 text-[9px] text-black/40 font-mono">
            <span>p50: {stats.p50}ms</span>
            <span>p90: {stats.p90}ms</span>
            <span>p99: {stats.p99}ms</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorsTab({ canvasId, days }: { canvasId: string; days: number }) {
  const { data, isLoading } = useErrorStats(canvasId, days);

  if (isLoading) return <LoadingState />;
  if (!data || data.length === 0) return <EmptyState message="No error data yet" />;

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider mb-3">
        Error Rate by Day
      </div>
      {data.map((entry) => {
        const date = new Date(entry.day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return (
          <div key={entry.day} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-black/70">{date}</span>
              <span className="text-[10px] font-mono text-black/40">
                {entry.failed}/{entry.total} ({(entry.errorRate * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-black/[0.03] rounded-md overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-green-300 rounded-md"
                style={{ width: `${(entry.total / maxTotal) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-red-400 rounded-md"
                style={{ width: `${(entry.failed / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CostsTab({ canvasId, days }: { canvasId: string; days: number }) {
  const { data, isLoading } = useCostStats(canvasId, days);

  if (isLoading) return <LoadingState />;
  if (!data || data.length === 0) return <EmptyState message="No cost data yet" />;

  const totalCost = data.reduce((sum, d) => sum + d.totalCost, 0);
  const totalTokens = data.reduce((sum, d) => sum + d.totalTokens, 0);
  const totalRuns = data.reduce((sum, d) => sum + d.totalRuns, 0);
  const maxCost = Math.max(...data.map((d) => d.totalCost));

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total Cost", value: `$${totalCost.toFixed(4)}` },
          { label: "Total Tokens", value: totalTokens.toLocaleString() },
          { label: "Total Runs", value: totalRuns.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="p-2 bg-black/[0.02] rounded-md border border-black/[0.04]">
            <div className="text-[9px] text-black/40 uppercase">{label}</div>
            <div className="text-[13px] font-semibold text-black/70 font-mono">{value}</div>
          </div>
        ))}
      </div>

      {/* Daily breakdown */}
      <div>
        <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider mb-2">
          Daily Cost Trend
        </div>
        {data.map((entry) => {
          const date = new Date(entry.day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <div key={entry.day} className="flex items-center gap-2 py-1">
              <span className="text-[10px] text-black/50 w-12 shrink-0">{date}</span>
              <div className="flex-1 h-3 bg-black/[0.03] rounded-md overflow-hidden">
                {maxCost > 0 && (
                  <div
                    className="h-full bg-amber-300 rounded-md"
                    style={{ width: `${(entry.totalCost / maxCost) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-[10px] text-black/40 font-mono w-16 text-right">
                ${entry.totalCost.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-32 text-[11px] text-black/30">
      Loading...
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-[11px] text-black/30">
      {message}
    </div>
  );
}
