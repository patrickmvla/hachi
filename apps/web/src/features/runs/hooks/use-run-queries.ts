import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRunsList, fetchRunDetails, fetchRunEvals, setRunBaseline } from "../api/runs-api";

export function useRunsList(canvasId: string) {
  return useQuery({
    queryKey: queryKeys.runs.list(canvasId),
    queryFn: () => fetchRunsList(canvasId),
  });
}

export function useRunDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.runs.detail(id),
    queryFn: () => fetchRunDetails(id),
  });
}

export function useRunEvals(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.evaluation.evals(id),
    queryFn: () => fetchRunEvals(id),
    enabled,
  });
}

export function useSetBaseline(runId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => setRunBaseline(runId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.runs.detail(runId) });
    },
  });
}
