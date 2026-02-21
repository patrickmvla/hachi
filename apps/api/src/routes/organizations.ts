import { Hono } from "hono";
import { auth } from "@hachi/auth/server";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/organization";

export const organizationRoutes = new Hono<AppEnv>()
  // List user's organizations
  .get("/", requireAuth, async (c) => {
    try {
      const orgs = await auth.api.listOrganizations({
        headers: c.req.raw.headers,
      });
      return c.json({ organizations: orgs });
    } catch (error) {
      console.error("Error listing organizations:", error);
      return c.json({ error: "Failed to list organizations" }, 500);
    }
  })

  // Create organization
  .post("/", requireAuth, async (c) => {
    try {
      const body = await c.req.json();
      const org = await auth.api.createOrganization({
        body: { name: body.name, slug: body.slug },
        headers: c.req.raw.headers,
      });
      return c.json({ organization: org }, 201);
    } catch (error) {
      console.error("Error creating organization:", error);
      return c.json({ error: "Failed to create organization" }, 500);
    }
  })

  // Get organization details
  .get("/:orgId", requireAuth, async (c) => {
    const orgId = c.req.param("orgId");
    try {
      const org = await auth.api.getFullOrganization({
        query: { organizationId: orgId },
        headers: c.req.raw.headers,
      });
      return c.json({ organization: org });
    } catch (error) {
      console.error("Error getting organization:", error);
      return c.json({ error: "Organization not found" }, 404);
    }
  })

  // Update organization
  .put(
    "/:orgId",
    requireAuth,
    requirePermission({ organization: ["update"] }),
    async (c) => {
      try {
        const body = await c.req.json();
        const org = await auth.api.updateOrganization({
          body: {
            data: {
              name: body.name,
              slug: body.slug,
              logo: body.logo,
            },
          },
          headers: c.req.raw.headers,
        });
        return c.json({ organization: org });
      } catch (error) {
        console.error("Error updating organization:", error);
        return c.json({ error: "Failed to update organization" }, 500);
      }
    }
  )

  // Delete organization
  .delete(
    "/:orgId",
    requireAuth,
    requirePermission({ organization: ["delete"] }),
    async (c) => {
      const orgId = c.req.param("orgId");
      try {
        await auth.api.deleteOrganization({
          body: { organizationId: orgId },
          headers: c.req.raw.headers,
        });
        return c.json({ success: true, deleted: orgId });
      } catch (error) {
        console.error("Error deleting organization:", error);
        return c.json({ error: "Failed to delete organization" }, 500);
      }
    }
  );
