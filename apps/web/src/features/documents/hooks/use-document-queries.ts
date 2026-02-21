import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchDocumentList } from "../api/documents-api";

export function useDocumentList(orgId?: string) {
  return useQuery({
    queryKey: queryKeys.documents.list(orgId!),
    queryFn: () => fetchDocumentList(orgId!),
    enabled: !!orgId,
  });
}
