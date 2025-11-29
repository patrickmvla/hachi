import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { runs, stepOutputs } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { eq, and } from "drizzle-orm";

const executeRunSchema = z.object({
  canvasId: z.string().uuid(),
  input: z.record(z.unknown()),
});

export const runRoutes = new Hono<AppEnv>()
  // List runs for canvas
  .get("/", requireAuth, async (c) => {
    const canvasId = c.req.query("canvasId");

    if (!canvasId) {
      return c.json({ error: "canvasId query parameter required" }, 400);
    }

    const canvasRuns = await db
      .select()
      .from(runs)
      .where(eq(runs.canvasId, canvasId))
      .orderBy(runs.startedAt);

    return c.json({ runs: canvasRuns });
  })

  // Get run by ID with step outputs
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const [run] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!run) {
      return c.json({ error: "Run not found" }, 404);
    }

    // Get step outputs for this run
    const steps = await db
      .select()
      .from(stepOutputs)
      .where(eq(stepOutputs.runId, id))
      .orderBy(stepOutputs.createdAt);

    return c.json({ run, stepOutputs: steps });
  })

  // Execute run (create run and stream execution)
  .post("/execute", requireAuth, zValidator("json", executeRunSchema), async (c) => {
    const { canvasId, input } = c.req.valid("json");
    const user = c.get("user");

    return streamSSE(c, async (stream) => {
      // Create run record
      const result = await db
        .insert(runs)
        .values({
          canvasId,
          triggeredBy: user.id,
          input,
          status: "running",
          startedAt: new Date(),
        })
        .returning();

      const run = result[0];
      if (!run) {
        throw new Error("Failed to create run record");
      }

      await stream.writeSSE({
        event: "run:started",
        data: JSON.stringify({ runId: run.id, canvasId }),
      });

      // TODO: Execute Mastra workflow and stream step outputs
      // For now, just mark as completed
      await db
        .update(runs)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(runs.id, run.id));

      await stream.writeSSE({
        event: "run:completed",
        data: JSON.stringify({ runId: run.id, status: "completed" }),
      });
    });
  })

  // Get step output for Wire Tap
  .get("/:runId/steps/:nodeId", requireAuth, async (c) => {
    const runId = c.req.param("runId");
    const nodeId = c.req.param("nodeId");

    const [stepOutput] = await db
      .select()
      .from(stepOutputs)
      .where(
        and(
          eq(stepOutputs.runId, runId),
          eq(stepOutputs.nodeId, nodeId)
        )
      )
      .limit(1);

    if (!stepOutput) {
      return c.json({ error: "Step output not found" }, 404);
    }

    return c.json({ stepOutput });
  });
