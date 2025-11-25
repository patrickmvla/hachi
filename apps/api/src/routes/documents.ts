import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const uploadDocumentSchema = z.object({
  workspaceId: z.string().uuid(),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

const searchSchema = z.object({
  query: z.string(),
  workspaceId: z.string().uuid(),
  limit: z.number().optional().default(10),
});

export const documentRoutes = new Hono()
  .get("/", async (c) => {
    const workspaceId = c.req.query("workspaceId");
    // TODO: Fetch from database
    return c.json({ documents: [] });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO: Fetch from database
    return c.json({ id, content: "", metadata: {} });
  })
  .post("/", zValidator("json", uploadDocumentSchema), async (c) => {
    const data = c.req.valid("json");
    // TODO: Save to database and generate embedding
    return c.json({ id: crypto.randomUUID(), ...data }, 201);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO: Delete from database
    return c.json({ deleted: true, id });
  })
  .post("/search", zValidator("json", searchSchema), async (c) => {
    const { query, workspaceId, limit } = c.req.valid("json");
    // TODO: Perform vector search
    return c.json({ results: [] });
  });
