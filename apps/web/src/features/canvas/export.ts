import { canvasExportSchema, type CanvasExport } from "@hachi/schemas/canvas";
import type { HachiNode, HachiEdge } from "@/stores/canvas-store";

/**
 * Sensitive config keys that should be stripped on export.
 */
const SENSITIVE_KEYS = new Set([
  "apiKey",
  "api_key",
  "apikey",
  "password",
  "token",
  "secret",
  "connectionString",
  "connection_string",
]);

function stripSensitiveKeys(config: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (SENSITIVE_KEYS.has(key)) continue;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      cleaned[key] = stripSensitiveKeys(value as Record<string, unknown>);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Exports canvas nodes and edges to the portable .hachi.json format.
 * Strips sensitive config values.
 */
export function exportCanvas(name: string, nodes: HachiNode[], edges: HachiEdge[]): CanvasExport {
  const cleanNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type || node.data.type,
    position: node.position,
    data: {
      label: node.data.label,
      type: node.data.type,
      config: node.data.config ? stripSensitiveKeys(node.data.config) : undefined,
    },
  }));

  const cleanEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    data: edge.data ? { ...edge.data } : undefined,
  }));

  return {
    version: "1.0",
    name,
    nodes: cleanNodes,
    edges: cleanEdges,
    metadata: {
      exportedAt: new Date().toISOString(),
      nodeCount: cleanNodes.length,
      edgeCount: cleanEdges.length,
    },
  };
}

/**
 * Validates and imports a canvas export, remapping all IDs to avoid collisions.
 */
export function importCanvas(json: unknown): { nodes: HachiNode[]; edges: HachiEdge[]; name: string } {
  const parsed = canvasExportSchema.parse(json);

  // Remap node IDs
  const idMap = new Map<string, string>();
  for (const node of parsed.nodes) {
    const newId = `${node.type || node.data.type}-${crypto.randomUUID().slice(0, 8)}`;
    idMap.set(node.id, newId);
  }

  const nodes: HachiNode[] = parsed.nodes.map((node) => ({
    id: idMap.get(node.id)!,
    type: node.type || node.data.type,
    position: node.position,
    data: {
      label: node.data.label,
      type: node.data.type,
      config: node.data.config as Record<string, unknown> | undefined,
    },
  }));

  const edges: HachiEdge[] = parsed.edges.map((edge) => ({
    id: `edge-${crypto.randomUUID().slice(0, 8)}`,
    source: idMap.get(edge.source) || edge.source,
    target: idMap.get(edge.target) || edge.target,
    data: edge.data as HachiEdge["data"],
  }));

  return { nodes, edges, name: parsed.name };
}

/**
 * Triggers a browser download of the canvas as a .hachi.json file.
 */
export function exportCanvasAsFile(name: string, nodes: HachiNode[], edges: HachiEdge[]) {
  const data = exportCanvas(name, nodes, edges);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.toLowerCase().replace(/\s+/g, "-")}.hachi.json`;
  link.click();
  URL.revokeObjectURL(url);
}
