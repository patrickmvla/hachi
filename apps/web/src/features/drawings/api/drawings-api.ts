import { apiFetch, unwrap } from "@/lib/api";

export interface Drawing {
  id: string;
  name: string;
  organizationId: string;
  drawingJson: Record<string, unknown>;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function fetchDrawingList(orgId: string) {
  const { drawings } = unwrap(
    await apiFetch<{ drawings: Drawing[] }>(
      `/api/drawings?organizationId=${orgId}`
    )
  );
  return drawings;
}

export async function fetchDrawing(id: string) {
  const { drawing } = unwrap(
    await apiFetch<{ drawing: Drawing }>(`/api/drawings/${id}`)
  );
  return drawing;
}

export async function createDrawing(
  organizationId: string,
  name: string,
  drawingJson: Record<string, unknown> = {}
) {
  const { drawing } = unwrap(
    await apiFetch<{ drawing: Drawing }>(
      `/api/drawings?organizationId=${organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({ name, drawingJson }),
      }
    )
  );
  return drawing;
}

export async function updateDrawing(
  id: string,
  updates: Partial<{ name: string; drawingJson: Record<string, unknown> }>
) {
  const { drawing } = unwrap(
    await apiFetch<{ drawing: Drawing }>(`/api/drawings/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  );
  return drawing;
}

export async function deleteDrawing(id: string) {
  return unwrap(
    await apiFetch<{ deleted: boolean; id: string }>(`/api/drawings/${id}`, {
      method: "DELETE",
    })
  );
}
