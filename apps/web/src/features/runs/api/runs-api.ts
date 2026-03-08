import { apiFetch, unwrap } from "@/lib/api";

export interface Run {
  id: string;
  canvasId: string;
  triggeredBy: string;
  input: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  totalTokens: number | null;
  totalCost: number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  datasetId: string | null;
  batchId: string | null;
  isBaseline: boolean;
  variantLabel: string | null;
}

export interface TraceData {
  model?: string;
  provider?: string;
  tokenCount?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  cost?: {
    input?: number;
    output?: number;
    total?: number;
  };
  dimensions?: number;
  documentCount?: number;
  finishReason?: string;
}

export interface StepOutput {
  id: string;
  runId: string;
  nodeId: string;
  input: Record<string, unknown> | null;
  output: Record<string, unknown>;
  trace: TraceData | null;
  latencyMs: number;
  createdAt: string | null;
}

export interface EvalResult {
  id: string;
  runId: string;
  nodeId: string;
  metric: string;
  score: number;
  reasoning: string | null;
  details: unknown;
  createdAt: string | null;
}

export async function fetchRunsList(canvasId: string) {
  const { runs } = unwrap(
    await apiFetch<{ runs: Run[] }>(`/api/runs?canvasId=${canvasId}`)
  );
  return runs;
}

export async function fetchRunDetails(id: string) {
  return unwrap(
    await apiFetch<{ run: Run; stepOutputs: StepOutput[] }>(`/api/runs/${id}`)
  );
}

export async function fetchRunEvals(id: string) {
  const { evalResults } = unwrap(
    await apiFetch<{ evalResults: EvalResult[] }>(`/api/runs/${id}/evals`)
  );
  return evalResults;
}

export async function setRunBaseline(id: string) {
  return unwrap(
    await apiFetch<{ success: boolean }>(`/api/runs/${id}/baseline`, {
      method: "POST",
    })
  );
}
