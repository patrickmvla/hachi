import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchCanvasList, fetchCanvas } from "../api/canvas-api";

export function useCanvasList(orgId?: string) {
  return useQuery({
    queryKey: queryKeys.canvases.list(orgId!),
    queryFn: () => fetchCanvasList(orgId!),
    enabled: !!orgId,
  });
}

export function useCanvas(id: string) {
  return useQuery({
    queryKey: queryKeys.canvases.detail(id),
    queryFn: () => fetchCanvas(id),
  });
}
