import { apiFetch } from "@/lib/api";

export interface Template {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  nodes: number;
  tags: string[];
  graphJson: { nodes: unknown[]; edges: unknown[] };
  createdAt: string | null;
}

export async function fetchTemplates() {
  const { data, error } = await apiFetch<{ templates: Template[] }>(
    "/api/templates"
  );
  if (error) throw new Error(error);
  return data!.templates;
}

export async function fetchTemplate(id: string) {
  const { data, error } = await apiFetch<{ template: Template }>(
    `/api/templates/${id}`
  );
  if (error) throw new Error(error);
  return data!.template;
}
