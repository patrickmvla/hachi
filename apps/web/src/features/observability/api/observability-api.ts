const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface LatencyStats {
  [nodeType: string]: { p50: number; p90: number; p99: number; count: number };
}

export interface ErrorEntry {
  day: string;
  total: number;
  failed: number;
  errorRate: number;
}

export interface CostEntry {
  day: string;
  totalRuns: number;
  totalTokens: number;
  totalCost: number;
}

export interface SpanEntry {
  id: string;
  runId: string;
  traceId: string;
  parentSpanId: string | null;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  latencyMs: number | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  trace: Record<string, unknown> | null;
}

export async function fetchLatencyStats(canvasId: string, days = 7): Promise<LatencyStats> {
  const res = await fetch(`${API_BASE}/api/observability/latency?canvasId=${canvasId}&days=${days}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch latency stats");
  const data = await res.json();
  return data.latency;
}

export async function fetchErrorStats(canvasId: string, days = 7): Promise<ErrorEntry[]> {
  const res = await fetch(`${API_BASE}/api/observability/errors?canvasId=${canvasId}&days=${days}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch error stats");
  const data = await res.json();
  return data.errors;
}

export async function fetchCostStats(canvasId: string, days = 30): Promise<CostEntry[]> {
  const res = await fetch(`${API_BASE}/api/observability/costs?canvasId=${canvasId}&days=${days}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch cost stats");
  const data = await res.json();
  return data.costs;
}

export async function fetchRunSpans(runId: string): Promise<SpanEntry[]> {
  const res = await fetch(`${API_BASE}/api/observability/runs/${runId}/spans`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch spans");
  const data = await res.json();
  return data.spans;
}
