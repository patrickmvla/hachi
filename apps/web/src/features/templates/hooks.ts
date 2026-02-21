import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTemplates, fetchTemplate } from "./api";

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.all,
    queryFn: fetchTemplates,
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.templates.detail(id),
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  });
}
