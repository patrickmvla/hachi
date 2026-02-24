import { apiFetch, unwrap, API_BASE_URL } from "@/lib/api";

export interface Run {
  id: string;
  canvasId: string;
  triggeredBy: string;
  input: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
}

export interface StepOutput {
  id: string;
  runId: string;
  nodeId: string;
  output: Record<string, unknown>;
  latencyMs: number;
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

export function executeRun(
  canvasId: string,
  input: Record<string, unknown>
) {
  return new EventSource(
    `${API_BASE_URL}/api/runs/execute?canvasId=${canvasId}&input=${encodeURIComponent(
      JSON.stringify(input)
    )}`
  );
}
