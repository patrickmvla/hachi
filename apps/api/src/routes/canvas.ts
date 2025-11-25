import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createCanvasSchema = z.object({
  name: z.string().min(1),
  workspaceId: z.string().uuid(),
  graphJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
});

export const canvasRoutes = new Hono()
  .get("/", async (c) => {
    // TODO: Fetch from database
    return c.json({ canvases: [] });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO: Fetch from database
    return c.json({ id, name: "Untitled", graphJson: { nodes: [], edges: [] } });
  })
  .post("/", zValidator("json", createCanvasSchema), async (c) => {
    const data = c.req.valid("json");
    // TODO: Save to database
    return c.json({ id: crypto.randomUUID(), ...data }, 201);
  })
  .put("/:id", zValidator("json", createCanvasSchema.partial()), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    // TODO: Update in database
    return c.json({ id, ...data });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO: Delete from database
    return c.json({ deleted: true, id });
  });
