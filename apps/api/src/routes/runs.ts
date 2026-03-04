import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { runs, stepOutputs, canvases } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireOrganization, requirePermission } from "../middleware/organization";
import { eq, and } from "drizzle-orm";
import { executeGraph } from "../services/execution/runner";
import type { RunnerConfig, RunInput } from "../services/execution/runner";
import { transformGraphForExecution } from "../services/execution/graph-transform";
import { getCredential } from "../services/workspace/credentials";
import type { AnySSEEvent } from "@hachi/schemas/execution";

const executeRunSchema = z.object({
  canvasId: z.string().uuid(),
  input: z.record(z.string(), z.unknown()),
});

/**
 * Fetches org credentials in parallel and assembles a RunnerConfig.
 */
const buildRunnerConfig = async (organizationId: string): Promise<RunnerConfig> => {
  const [openai, anthropic, pinecone, pineconeHost, database] = await Promise.all([
    getCredential(organizationId, "openai", "api_key"),
    getCredential(organizationId, "anthropic", "api_key"),
    getCredential(organizationId, "pinecone", "api_key"),
    getCredential(organizationId, "pinecone", "index_host"),
    getCredential(organizationId, "database", "connection_string"),
  ]);

  return {
    openaiApiKey: openai?.value,
    anthropicApiKey: anthropic?.value,
    pineconeApiKey: pinecone?.value,
    pineconeIndexHost: pineconeHost?.value,
    databaseUrl: database?.value,
  };
};

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
  .post("/execute", requireAuth, requireOrganization, requirePermission({ canvas: ["execute"] }), zValidator("json", executeRunSchema), async (c) => {
    const { canvasId, input } = c.req.valid("json");
    const user = c.get("user");
    const organizationId = c.get("organizationId");

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

      try {
        // Fetch canvas graph
        const [canvas] = await db
          .select()
          .from(canvases)
          .where(and(eq(canvases.id, canvasId), eq(canvases.organizationId, organizationId)))
          .limit(1);

        if (!canvas) {
          throw new Error("Canvas not found");
        }

        // Transform frontend node types to compiler types
        const graph = transformGraphForExecution(canvas.graphJson as any);

        // Build runner config from org credentials
        const config = await buildRunnerConfig(organizationId);

        // Track step inputs from step:started events (step:completed doesn't carry input)
        const stepInputMap = new Map<string, Record<string, unknown>>();

        // Execute graph with SSE streaming
        await executeGraph(graph, input as RunInput, config, async (event: AnySSEEvent) => {
          // Substitute DB run ID in all events sent to client
          const clientEvent = { ...event, runId: run.id };

          // Stream event to client (safe against disconnect)
          try {
            await stream.writeSSE({
              event: clientEvent.type,
              data: JSON.stringify(clientEvent),
            });
          } catch {
            // Client disconnected — continue DB persistence
          }

          // Persist based on event type
          if (event.type === "step:started") {
            stepInputMap.set(event.data.nodeId, event.data.input);
          }

          if (event.type === "step:completed") {
            const capturedInput = stepInputMap.get(event.data.nodeId);
            await db.insert(stepOutputs).values({
              runId: run.id,
              nodeId: event.data.nodeId,
              input: capturedInput ?? {},
              output: event.data.output,
              trace: event.data.trace ?? null,
              latencyMs: event.data.latencyMs,
            });
          }

          if (event.type === "run:completed") {
            await db
              .update(runs)
              .set({
                status: "completed",
                completedAt: new Date(),
                totalTokens: event.data.trace?.totalTokens ?? null,
                totalCost: event.data.trace?.totalCost ?? null,
              })
              .where(eq(runs.id, run.id));
          }

          if (event.type === "run:failed") {
            await db
              .update(runs)
              .set({ status: "failed", completedAt: new Date() })
              .where(eq(runs.id, run.id));
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Execution failed";

        // Mark run as failed
        await db
          .update(runs)
          .set({ status: "failed", completedAt: new Date() })
          .where(eq(runs.id, run.id));

        // Send failure event to client
        try {
          await stream.writeSSE({
            event: "run:failed",
            data: JSON.stringify({ runId: run.id, type: "run:failed", error: errorMessage }),
          });
        } catch {
          // Client already disconnected
        }
      }
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
