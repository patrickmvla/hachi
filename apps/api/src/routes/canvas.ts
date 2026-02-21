import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { canvases } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireOrganization, requirePermission } from "../middleware/organization";
import { eq } from "drizzle-orm";

const createCanvasSchema = z.object({
  name: z.string().min(1),
  graphJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
});

export const canvasRoutes = new Hono<AppEnv>()
  // List canvases for active organization
  .get("/", requireAuth, requireOrganization, async (c) => {
    const organizationId = c.get("organizationId");

    const orgCanvases = await db
      .select()
      .from(canvases)
      .where(eq(canvases.organizationId, organizationId))
      .orderBy(canvases.updatedAt);

    return c.json({ canvases: orgCanvases });
  })

  // Get canvas by ID
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const [canvas] = await db
      .select()
      .from(canvases)
      .where(eq(canvases.id, id))
      .limit(1);

    if (!canvas) {
      return c.json({ error: "Canvas not found" }, 404);
    }

    return c.json({ canvas });
  })

  // Create canvas
  .post(
    "/",
    requireAuth,
    requireOrganization,
    requirePermission({ canvas: ["create"] }),
    zValidator("json", createCanvasSchema),
    async (c) => {
      const user = c.get("user");
      const organizationId = c.get("organizationId");
      const data = c.req.valid("json");

      const [canvas] = await db
        .insert(canvases)
        .values({
          name: data.name,
          organizationId,
          graphJson: data.graphJson,
          createdBy: user.id,
        })
        .returning();

      return c.json({ canvas }, 201);
    }
  )

  // Update canvas
  .put(
    "/:id",
    requireAuth,
    requirePermission({ canvas: ["update"] }),
    zValidator("json", createCanvasSchema.partial()),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");

      const [existing] = await db
        .select()
        .from(canvases)
        .where(eq(canvases.id, id))
        .limit(1);

      if (!existing) {
        return c.json({ error: "Canvas not found" }, 404);
      }

      const [updated] = await db
        .update(canvases)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(canvases.id, id))
        .returning();

      return c.json({ canvas: updated });
    }
  )

  // Delete canvas
  .delete(
    "/:id",
    requireAuth,
    requirePermission({ canvas: ["delete"] }),
    async (c) => {
      const id = c.req.param("id");

      const [existing] = await db
        .select()
        .from(canvases)
        .where(eq(canvases.id, id))
        .limit(1);

      if (!existing) {
        return c.json({ error: "Canvas not found" }, 404);
      }

      await db.delete(canvases).where(eq(canvases.id, id));

      return c.json({ deleted: true, id });
    }
  );
