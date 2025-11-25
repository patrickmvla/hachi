import { z } from "zod";

export const runSchema = z.object({
  id: z.string().uuid(),
  canvasId: z.string().uuid(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  input: z.record(z.unknown()),
  output: z.record(z.unknown()).optional(),
});

export type Run = z.infer<typeof runSchema>;
