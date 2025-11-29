import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { workspaces, workspaceMembers } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireWorkspace, requireRole } from "../middleware/workspace";
import { eq } from "drizzle-orm";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
});

export const workspaceRoutes = new Hono<AppEnv>()
  // List user's workspaces
  .get("/", requireAuth, async (c) => {
    const user = c.get("user");

    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        createdAt: workspaces.createdAt,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, user.id))
      .orderBy(workspaceMembers.joinedAt);

    return c.json({ workspaces: userWorkspaces });
  })

  // Create workspace
  .post("/", requireAuth, zValidator("json", createWorkspaceSchema), async (c) => {
    const user = c.get("user");
    const { name } = c.req.valid("json");

    try {
      // Create workspace and add user as owner in transaction
      const result = await db.transaction(async (tx) => {
        // Create workspace
        const insertResult = await tx
          .insert(workspaces)
          .values({ name })
          .returning();

        const workspace = insertResult[0];
        if (!workspace) {
          throw new Error("Failed to create workspace");
        }

        // Add creator as owner
        await tx.insert(workspaceMembers).values({
          workspaceId: workspace.id,
          userId: user.id,
          role: "owner",
        });

        return workspace;
      });

      return c.json({ workspace: result }, 201);
    } catch (error) {
      console.error("Error creating workspace:", error);
      return c.json({ error: "Failed to create workspace" }, 500);
    }
  })

  // Get workspace details
  .get("/:workspaceId", requireAuth, requireWorkspace, async (c) => {
    const workspace = c.get("workspace");
    const memberRole = c.get("memberRole");

    // Get member count
    const members = await db
      .select({
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspace.id));

    return c.json({
      workspace: {
        ...workspace,
        memberCount: members.length,
        userRole: memberRole,
      },
    });
  })

  // Update workspace
  .put(
    "/:workspaceId",
    requireAuth,
    requireWorkspace,
    requireRole("owner", "admin"),
    zValidator("json", updateWorkspaceSchema),
    async (c) => {
      const workspace = c.get("workspace");
      const updates = c.req.valid("json");

      if (Object.keys(updates).length === 0) {
        return c.json({ error: "No updates provided" }, 400);
      }

      try {
        const [updated] = await db
          .update(workspaces)
          .set(updates)
          .where(eq(workspaces.id, workspace.id))
          .returning();

        return c.json({ workspace: updated });
      } catch (error) {
        console.error("Error updating workspace:", error);
        return c.json({ error: "Failed to update workspace" }, 500);
      }
    }
  )

  // Delete workspace
  .delete(
    "/:workspaceId",
    requireAuth,
    requireWorkspace,
    requireRole("owner"),
    async (c) => {
      const workspace = c.get("workspace");

      try {
        await db.delete(workspaces).where(eq(workspaces.id, workspace.id));

        return c.json({ success: true, deleted: workspace.id });
      } catch (error) {
        console.error("Error deleting workspace:", error);
        return c.json({ error: "Failed to delete workspace" }, 500);
      }
    }
  );
