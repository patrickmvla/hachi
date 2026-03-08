import { apiFetch, unwrap } from "@/lib/api";

export interface TestDataset {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  caseCount?: number;
}

export interface TestCase {
  id: string;
  datasetId: string;
  query: string;
  groundTruth: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
}

export interface EvalAggregate {
  mean: number;
  p50: number;
  p90: number;
  count: number;
}

export async function fetchDatasets() {
  const { datasets } = unwrap(
    await apiFetch<{ datasets: TestDataset[] }>("/api/evaluation/datasets")
  );
  return datasets;
}

export async function createDataset(data: { name: string; description?: string }) {
  const { dataset } = unwrap(
    await apiFetch<{ dataset: TestDataset }>("/api/evaluation/datasets", {
      method: "POST",
      body: JSON.stringify(data),
    })
  );
  return dataset;
}

export async function fetchDatasetWithCases(id: string) {
  return unwrap(
    await apiFetch<{ dataset: TestDataset; cases: TestCase[] }>(
      `/api/evaluation/datasets/${id}`
    )
  );
}

export async function deleteDataset(id: string) {
  return unwrap(
    await apiFetch<{ success: boolean }>(`/api/evaluation/datasets/${id}`, {
      method: "DELETE",
    })
  );
}

export async function addTestCases(
  datasetId: string,
  cases: Array<{ query: string; groundTruth?: string; metadata?: Record<string, unknown> }>
) {
  const { cases: inserted } = unwrap(
    await apiFetch<{ cases: TestCase[] }>(
      `/api/evaluation/datasets/${datasetId}/cases`,
      {
        method: "POST",
        body: JSON.stringify({ cases }),
      }
    )
  );
  return inserted;
}

export async function deleteTestCase(id: string) {
  return unwrap(
    await apiFetch<{ success: boolean }>(`/api/evaluation/cases/${id}`, {
      method: "DELETE",
    })
  );
}

export async function fetchBatchResults(batchId: string) {
  return unwrap(
    await apiFetch<{
      runs: Array<Record<string, unknown>>;
      evalResults: Array<Record<string, unknown>>;
      aggregates: Record<string, EvalAggregate>;
    }>(`/api/evaluation/batches/${batchId}`)
  );
}

export async function fetchEvalThresholds(canvasId: string) {
  const { thresholds } = unwrap(
    await apiFetch<{
      thresholds: Array<{ id: string; canvasId: string; metric: string; threshold: number }>;
    }>(`/api/evaluation/thresholds/${canvasId}`)
  );
  return thresholds;
}

export async function setEvalThreshold(data: {
  canvasId: string;
  metric: string;
  threshold: number;
}) {
  return unwrap(
    await apiFetch<{ threshold: Record<string, unknown> }>(
      "/api/evaluation/thresholds",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
  );
}
