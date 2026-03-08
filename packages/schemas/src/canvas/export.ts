import { z } from "zod";

/**
 * Canvas Export/Import Schema
 * Defines the .hachi.json format for portable canvas sharing.
 */

export const canvasExportSchema = z.object({
  version: z.literal("1.0"),
  name: z.string(),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      label: z.string(),
      type: z.string(),
      config: z.record(z.string(), z.unknown()).optional(),
    }).passthrough(),
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    data: z.record(z.string(), z.unknown()).optional(),
  }).passthrough()),
  metadata: z.object({
    exportedAt: z.string(),
    nodeCount: z.number(),
    edgeCount: z.number(),
  }).optional(),
});

export type CanvasExport = z.infer<typeof canvasExportSchema>;
