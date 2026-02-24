import { apiFetch, unwrap } from "@/lib/api";

export interface GraphJson {
  nodes: unknown[];
  edges: unknown[];
}

export interface Canvas {
  id: string;
  name: string;
  organizationId: string | null;
  graphJson: GraphJson;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function fetchCanvasList(orgId: string) {
  const { canvases } = unwrap(
    await apiFetch<{ canvases: Canvas[] }>(
      `/api/canvases?organizationId=${orgId}`
    )
  );
  return canvases;
}

export async function fetchCanvas(id: string) {
  const { canvas } = unwrap(
    await apiFetch<{ canvas: Canvas }>(`/api/canvases/${id}`)
  );
  return canvas;
}

export async function createCanvas(
  organizationId: string,
  name: string,
  graphJson: GraphJson
) {
  const { canvas } = unwrap(
    await apiFetch<{ canvas: Canvas }>(
      `/api/canvases?organizationId=${organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({ name, graphJson }),
      }
    )
  );
  return canvas;
}

export async function updateCanvas(
  id: string,
  updates: Partial<{ name: string; graphJson: GraphJson }>
) {
  const { canvas } = unwrap(
    await apiFetch<{ canvas: Canvas }>(`/api/canvases/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  );
  return canvas;
}

export async function deleteCanvas(id: string) {
  return unwrap(
    await apiFetch<{ deleted: boolean; id: string }>(`/api/canvases/${id}`, {
      method: "DELETE",
    })
  );
}
