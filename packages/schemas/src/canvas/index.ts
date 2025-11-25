import { z } from "zod";

export const canvasSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export type Canvas = z.infer<typeof canvasSchema>;
