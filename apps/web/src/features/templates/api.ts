import { apiFetch, unwrap } from "@/lib/api";
import type { GraphJson } from "@/features/canvas/api/canvas-api";

export interface Template {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  nodes: number;
  tags: string[];
  graphJson: GraphJson;
  createdAt: string | null;
}

export async function fetchTemplates() {
  const { templates } = unwrap(
    await apiFetch<{ templates: Template[] }>("/api/templates")
  );
  return templates;
}

export async function fetchTemplate(id: string) {
  const { template } = unwrap(
    await apiFetch<{ template: Template }>(`/api/templates/${id}`)
  );
  return template;
}
