import type { Context, Next } from "hono";
import { auth } from "@hachi/auth/server";

/**
 * Middleware to require an active organization.
 * Must be used after requireAuth middleware.
 *
 * Reads activeOrganizationId from context (set by requireAuth)
 * and sets organizationId on context.
 */
export const requireOrganization = async (c: Context, next: Next) => {
  const organizationId = c.get("activeOrganizationId");

  if (!organizationId) {
    return c.json(
      { error: "No active organization. Set an active organization first." },
      400
    );
  }

  c.set("organizationId", organizationId);
  await next();
};

/**
 * Middleware to require specific permissions via Better Auth's hasPermission.
 * Must be used after requireAuth middleware.
 *
 * Usage:
 *   requirePermission({ canvas: ["create"] })
 *   requirePermission({ organization: ["delete"] })
 *   requirePermission({ canvas: ["create"], document: ["create"] })
 */
export const requirePermission = (
  permissions: Record<string, string[]>
) => {
  return async (c: Context, next: Next) => {
    try {
      const result = await auth.api.hasPermission({
        headers: c.req.raw.headers,
        body: { permissions },
      });

      if (!result.success) {
        return c.json({ error: "Forbidden — insufficient permissions" }, 403);
      }

      await next();
    } catch (error) {
      console.error("Permission check error:", error);
      return c.json({ error: "Forbidden" }, 403);
    }
  };
};
