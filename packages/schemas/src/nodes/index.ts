import { z } from "zod";

// Base node schema
export const baseNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  config: z.record(z.unknown()).optional(),
});

export type BaseNode = z.infer<typeof baseNodeSchema>;
