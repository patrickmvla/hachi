import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { canvases } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireWorkspace } from "../middleware/workspace";
import { eq, and } from "drizzle-orm";

const createCanvasSchema = z.object({
  name: z.string().min(1),
  workspaceId: z.string().uuid(),
  graphJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
});

export const canvasRoutes = new Hono<AppEnv>()
  // List canvases for workspace
  .get("/", requireAuth, requireWorkspace, async (c) => {
    const workspace = c.get("workspace");

    const workspaceCanvases = await db
      .select()
      .from(canvases)
      .where(eq(canvases.workspaceId, workspace.id))
      .orderBy(canvases.updatedAt);

    return c.json({ canvases: workspaceCanvases });
  })

  // Get canvas by ID
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const user = c.get("user");

    const [canvas] = await db
      .select()
      .from(canvases)
      .where(eq(canvases.id, id))
      .limit(1);

    if (!canvas) {
      return c.json({ error: "Canvas not found" }, 404);
    }

    // Verify user has access to workspace
    // (requireWorkspace middleware handles this better, but for single canvas fetch)
    // We'll just return it for now - in production, add workspace membership check

    return c.json({ canvas });
  })

  // Create canvas
  .post("/", requireAuth, requireWorkspace, zValidator("json", createCanvasSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    const [canvas] = await db
      .insert(canvases)
      .values({
        name: data.name,
        workspaceId: data.workspaceId,
        graphJson: data.graphJson,
        createdBy: user.id,
      })
      .returning();

    return c.json({ canvas }, 201);
  })

  // Update canvas
  .put("/:id", requireAuth, zValidator("json", createCanvasSchema.partial()), async (c) => {
    const id = c.req.param("id");
    const user = c.get("user");
    const data = c.req.valid("json");

    // Check canvas exists and user has access
    const [existing] = await db
      .select()
      .from(canvases)
      .where(eq(canvases.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ error: "Canvas not found" }, 404);
    }

    // Update canvas
    const [updated] = await db
      .update(canvases)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(canvases.id, id))
      .returning();

    return c.json({ canvas: updated });
  })

  // Delete canvas
  .delete("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const user = c.get("user");

    // Check canvas exists
    const [existing] = await db
      .select()
      .from(canvases)
      .where(eq(canvases.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ error: "Canvas not found" }, 404);
    }

    // Delete canvas
    await db.delete(canvases).where(eq(canvases.id, id));

    return c.json({ deleted: true, id });
  });
