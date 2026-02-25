import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchDrawingList, fetchDrawing } from "../api/drawings-api";

export function useDrawingList(orgId?: string) {
  return useQuery({
    queryKey: queryKeys.drawings.list(orgId!),
    queryFn: () => fetchDrawingList(orgId!),
    enabled: !!orgId,
  });
}

export function useDrawing(id: string) {
  return useQuery({
    queryKey: queryKeys.drawings.detail(id),
    queryFn: () => fetchDrawing(id),
  });
}
