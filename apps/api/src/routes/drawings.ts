import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { drawings } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireOrganization, requirePermission } from "../middleware/organization";
import { eq } from "drizzle-orm";

const createDrawingSchema = z.object({
  name: z.string().min(1),
  drawingJson: z.record(z.any()).default({}),
});

export const drawingRoutes = new Hono<AppEnv>()
  // List drawings for active organization
  .get("/", requireAuth, requireOrganization, async (c) => {
    const organizationId = c.get("organizationId");

    const orgDrawings = await db
      .select()
      .from(drawings)
      .where(eq(drawings.organizationId, organizationId))
      .orderBy(drawings.updatedAt);

    return c.json({ drawings: orgDrawings });
  })

  // Get drawing by ID
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const [drawing] = await db
      .select()
      .from(drawings)
      .where(eq(drawings.id, id))
      .limit(1);

    if (!drawing) {
      return c.json({ error: "Drawing not found" }, 404);
    }

    return c.json({ drawing });
  })

  // Create drawing
  .post(
    "/",
    requireAuth,
    requireOrganization,
    requirePermission({ drawing: ["create"] }),
    zValidator("json", createDrawingSchema),
    async (c) => {
      const user = c.get("user");
      const organizationId = c.get("organizationId");
      const data = c.req.valid("json");

      const [drawing] = await db
        .insert(drawings)
        .values({
          name: data.name,
          organizationId,
          drawingJson: data.drawingJson,
          createdBy: user.id,
        })
        .returning();

      return c.json({ drawing }, 201);
    }
  )

  // Update drawing
  .put(
    "/:id",
    requireAuth,
    requirePermission({ drawing: ["update"] }),
    zValidator("json", createDrawingSchema.partial()),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");

      const [existing] = await db
        .select()
        .from(drawings)
        .where(eq(drawings.id, id))
        .limit(1);

      if (!existing) {
        return c.json({ error: "Drawing not found" }, 404);
      }

      const [updated] = await db
        .update(drawings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(drawings.id, id))
        .returning();

      return c.json({ drawing: updated });
    }
  )

  // Delete drawing
  .delete(
    "/:id",
    requireAuth,
    requirePermission({ drawing: ["delete"] }),
    async (c) => {
      const id = c.req.param("id");

      const [existing] = await db
        .select()
        .from(drawings)
        .where(eq(drawings.id, id))
        .limit(1);

      if (!existing) {
        return c.json({ error: "Drawing not found" }, 404);
      }

      await db.delete(drawings).where(eq(drawings.id, id));

      return c.json({ deleted: true, id });
    }
  );
