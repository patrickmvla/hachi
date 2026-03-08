import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchDatasets,
  createDataset,
  deleteDataset,
  fetchDatasetWithCases,
  addTestCases,
  deleteTestCase,
  fetchBatchResults,
  fetchEvalThresholds,
} from "../api/evaluation-api";

export function useDatasets(organizationId: string) {
  return useQuery({
    queryKey: queryKeys.evaluation.datasets(organizationId),
    queryFn: fetchDatasets,
  });
}

export function useCreateDataset(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evaluation.datasets(organizationId),
      });
    },
  });
}

export function useDeleteDataset(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evaluation.datasets(organizationId),
      });
    },
  });
}

export function useDatasetWithCases(datasetId: string) {
  return useQuery({
    queryKey: queryKeys.evaluation.dataset(datasetId),
    queryFn: () => fetchDatasetWithCases(datasetId),
  });
}

export function useAddTestCases(datasetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cases: Array<{ query: string; groundTruth?: string }>) =>
      addTestCases(datasetId, cases),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evaluation.dataset(datasetId),
      });
    },
  });
}

export function useDeleteTestCase(datasetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evaluation.dataset(datasetId),
      });
    },
  });
}

export function useBatchResults(batchId: string) {
  return useQuery({
    queryKey: queryKeys.evaluation.batch(batchId),
    queryFn: () => fetchBatchResults(batchId),
  });
}

export function useEvalThresholds(canvasId: string) {
  return useQuery({
    queryKey: queryKeys.evaluation.thresholds(canvasId),
    queryFn: () => fetchEvalThresholds(canvasId),
  });
}
