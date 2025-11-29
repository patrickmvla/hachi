import type { Context, Next } from "hono";
import { db } from "@hachi/database/client";
import { workspaceMembers, workspaces } from "@hachi/database/schema";
import { eq, and } from "drizzle-orm";

export interface WorkspaceContext extends Context {
  var: {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    workspace: {
      id: string;
      name: string;
    };
    memberRole: string; // 'owner', 'admin', 'editor', 'viewer'
  };
}

/**
 * Middleware to require workspace membership
 * Must be used after requireAuth middleware
 *
 * Expects workspaceId in:
 * - Query params (?workspaceId=xxx)
 * - Route params (/:workspaceId/)
 *
 * Note: We don't read from request body here to avoid consuming the body stream
 * which would make it unavailable for the actual route handler.
 */
export const requireWorkspace = async (c: Context, next: Next) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized - Authentication required" }, 401);
  }

  // Get workspace ID from query params or route params
  const workspaceId = 
    c.req.query("workspaceId") || 
    c.req.param("workspaceId");

  if (!workspaceId) {
    return c.json({ 
      error: "Workspace ID required in query (?workspaceId=xxx) or route params (/:workspaceId/)" 
    }, 400);
  }

  try {
    // Check workspace membership
    const membership = await db
      .select({
        workspaceId: workspaceMembers.workspaceId,
        workspaceName: workspaces.name,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, user.id)
        )
      )
      .limit(1);

    const memberRecord = membership[0];
    if (!memberRecord) {
      return c.json({
        error: "Forbidden - Not a member of this workspace"
      }, 403);
    }

    // Attach workspace and role to context
    c.set("workspace", {
      id: workspaceId,
      name: memberRecord.workspaceName,
    });
    c.set("memberRole", memberRecord.role);

    await next();
  } catch (error) {
    console.error("Workspace middleware error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

/**
 * Middleware to require specific role(s) in workspace
 * Must be used after requireWorkspace middleware
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const role = c.get("memberRole");
    
    if (!role) {
      return c.json({ error: "Workspace membership required" }, 403);
    }

    if (!allowedRoles.includes(role)) {
      return c.json({ 
        error: `Forbidden - Requires one of: ${allowedRoles.join(", ")}` 
      }, 403);
    }

    await next();
  };
};
