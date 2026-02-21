import { apiFetch } from "@/lib/api";

export interface Canvas {
  id: string;
  name: string;
  organizationId: string | null;
  graphJson: { nodes: unknown[]; edges: unknown[] };
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function fetchCanvasList(orgId: string) {
  const { data, error } = await apiFetch<{ canvases: Canvas[] }>(
    `/api/canvases?organizationId=${orgId}`
  );
  if (error) throw new Error(error);
  return data!.canvases;
}

export async function fetchCanvas(id: string) {
  const { data, error } = await apiFetch<{ canvas: Canvas }>(
    `/api/canvases/${id}`
  );
  if (error) throw new Error(error);
  return data!.canvas;
}

export async function createCanvas(
  organizationId: string,
  name: string,
  graphJson: { nodes: unknown[]; edges: unknown[] }
) {
  const { data, error } = await apiFetch<{ canvas: Canvas }>(
    `/api/canvases?organizationId=${organizationId}`,
    {
      method: "POST",
      body: JSON.stringify({ name, graphJson }),
    }
  );
  if (error) throw new Error(error);
  return data!.canvas;
}

export async function updateCanvas(
  id: string,
  updates: Partial<{
    name: string;
    graphJson: { nodes: unknown[]; edges: unknown[] };
  }>
) {
  const { data, error } = await apiFetch<{ canvas: Canvas }>(
    `/api/canvases/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    }
  );
  if (error) throw new Error(error);
  return data!.canvas;
}

export async function deleteCanvas(id: string) {
  const { data, error } = await apiFetch<{ deleted: boolean; id: string }>(
    `/api/canvases/${id}`,
    { method: "DELETE" }
  );
  if (error) throw new Error(error);
  return data!;
}
