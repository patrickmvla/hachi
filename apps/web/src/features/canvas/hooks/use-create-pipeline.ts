import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@hachi/auth/client";
import { createCanvas, type GraphJson } from "../api/canvas-api";
import { queryKeys } from "@/lib/query-keys";

export function useCreatePipeline() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: activeOrg } = authClient.useActiveOrganization();

  return useMutation({
    mutationFn: async ({
      name = "Untitled Pipeline",
      graphJson = { nodes: [], edges: [] } as GraphJson,
    }: {
      name?: string;
      graphJson?: GraphJson;
    } = {}) => {
      if (!activeOrg?.id) {
        throw new Error("No active organization. Please select one first.");
      }
      return createCanvas(activeOrg.id, name, graphJson);
    },
    onSuccess: (canvas) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canvases.all });
      router.push(`/pipelines/${canvas.id}`);
    },
  });
}
