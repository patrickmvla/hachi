import { Hono } from "hono";
import { db } from "@hachi/database/client";
import { templates } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { eq } from "drizzle-orm";

export const templateRoutes = new Hono<AppEnv>()
  // List all templates
  .get("/", async (c) => {
    const allTemplates = await db
      .select()
      .from(templates)
      .orderBy(templates.createdAt);

    return c.json({ templates: allTemplates });
  })

  // Get template by ID
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    if (!template) {
      return c.json({ error: "Template not found" }, 404);
    }

    return c.json({ template });
  });
