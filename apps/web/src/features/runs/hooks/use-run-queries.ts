import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRunsList, fetchRunDetails } from "../api/runs-api";

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
