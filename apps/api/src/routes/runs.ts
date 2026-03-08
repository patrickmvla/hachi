import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { runs, stepOutputs, spans, canvases, evalResults, testDatasets, testCases } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireOrganization, requirePermission } from "../middleware/organization";
import { eq, and, inArray } from "drizzle-orm";
import { executeGraph } from "../services/execution/runner";
import type { RunnerConfig, RunInput } from "../services/execution/runner";
import { transformGraphForExecution } from "../services/execution/graph-transform";
import { getCredential } from "../services/workspace/credentials";
import type { AnySSEEvent } from "@hachi/schemas/execution";
import { createLangfuseExporter } from "../services/execution/langfuse";

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
        const stepStartTimes = new Map<string, Date>();

        // Core event handler
        const onEvent = async (event: AnySSEEvent) => {
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
            stepStartTimes.set(event.data.nodeId, new Date());
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

            // Persist span
            const spanId = event.data.spanId;
            const traceId = event.data.traceId;
            if (spanId && traceId) {
              await db.insert(spans).values({
                id: spanId,
                runId: run.id,
                traceId,
                nodeId: event.data.nodeId,
                nodeType: event.data.nodeType,
                nodeLabel: event.data.nodeLabel,
                status: "completed",
                startedAt: stepStartTimes.get(event.data.nodeId) ?? new Date(),
                completedAt: new Date(),
                latencyMs: event.data.latencyMs,
                input: capturedInput ?? {},
                output: event.data.output,
                trace: event.data.trace ?? null,
              });
            }

            // Persist eval results for evaluator nodes
            const nodeType = event.data.nodeType as string | undefined;
            if (nodeType?.startsWith("eval-") && event.data.output) {
              const output = event.data.output as Record<string, unknown>;
              const score = output.score as number | undefined;
              if (score !== undefined) {
                const metric = nodeType.replace("eval-", "").replace("-", "_");
                await db.insert(evalResults).values({
                  runId: run.id,
                  nodeId: event.data.nodeId,
                  metric,
                  score,
                  reasoning: (output.reasoning as string) ?? null,
                  details: output.claims ?? output.perDocRelevance ?? null,
                });
              }
            }
          }

          if (event.type === "step:failed") {
            // Persist failed span
            const spanId = event.data.spanId;
            const traceId = event.data.traceId;
            if (spanId && traceId) {
              await db.insert(spans).values({
                id: spanId,
                runId: run.id,
                traceId,
                nodeId: event.data.nodeId,
                nodeType: event.data.nodeType,
                nodeLabel: event.data.nodeLabel,
                status: "failed",
                startedAt: stepStartTimes.get(event.data.nodeId) ?? new Date(),
                completedAt: new Date(),
                input: stepInputMap.get(event.data.nodeId) ?? {},
              });
            }
          }

          if (event.type === "run:completed") {
            await db
              .update(runs)
              .set({
                status: "completed",
                completedAt: new Date(),
                totalTokens: event.data.trace?.totalTokens ?? null,
                totalCost: event.data.trace?.totalCost ?? null,
                traceId: event.data.traceId ?? null,
                durationMs: event.data.totalLatencyMs ?? null,
              })
              .where(eq(runs.id, run.id));
          }

          if (event.type === "run:failed") {
            await db
              .update(runs)
              .set({
                status: "failed",
                completedAt: new Date(),
                error: event.data.error,
              })
              .where(eq(runs.id, run.id));
          }
        };

        // Wrap with Langfuse exporter if configured
        const handler = createLangfuseExporter(onEvent) ?? onEvent;

        // Execute graph with SSE streaming
        await executeGraph(graph, input as RunInput, config, handler);
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

  // Get eval results for a run
  .get("/:id/evals", requireAuth, async (c) => {
    const id = c.req.param("id");

    const evals = await db
      .select()
      .from(evalResults)
      .where(eq(evalResults.runId, id))
      .orderBy(evalResults.createdAt);

    return c.json({ evalResults: evals });
  })

  // Toggle baseline status for a run
  .post("/:id/baseline", requireAuth, requireOrganization, async (c) => {
    const id = c.req.param("id");

    // Get the run to find its canvasId
    const [run] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!run) {
      return c.json({ error: "Run not found" }, 404);
    }

    // Clear existing baseline for this canvas
    if (run.canvasId) {
      await db
        .update(runs)
        .set({ isBaseline: false })
        .where(and(eq(runs.canvasId, run.canvasId), eq(runs.isBaseline, true)));
    }

    // Set this run as baseline
    await db
      .update(runs)
      .set({ isBaseline: true })
      .where(eq(runs.id, id));

    return c.json({ success: true });
  })

  // Batch execute canvas on a test dataset
  .post("/:canvasId/batch", requireAuth, requireOrganization, requirePermission({ canvas: ["execute"] }), zValidator("json", z.object({
    datasetId: z.string().uuid(),
    variantLabel: z.string().optional(),
  })), async (c) => {
    const canvasId = c.req.param("canvasId");
    const { datasetId, variantLabel } = c.req.valid("json");
    const user = c.get("user");
    const organizationId = c.get("organizationId");

    return streamSSE(c, async (stream) => {
      // Fetch canvas
      const [canvas] = await db
        .select()
        .from(canvases)
        .where(and(eq(canvases.id, canvasId), eq(canvases.organizationId, organizationId)))
        .limit(1);

      if (!canvas) {
        await stream.writeSSE({
          event: "batch:failed",
          data: JSON.stringify({ error: "Canvas not found" }),
        });
        return;
      }

      // Fetch test cases
      const cases = await db
        .select()
        .from(testCases)
        .where(eq(testCases.datasetId, datasetId))
        .orderBy(testCases.createdAt);

      if (cases.length === 0) {
        await stream.writeSSE({
          event: "batch:failed",
          data: JSON.stringify({ error: "No test cases in dataset" }),
        });
        return;
      }

      const batchId = crypto.randomUUID();
      const graph = transformGraphForExecution(canvas.graphJson as any);
      const config = await buildRunnerConfig(organizationId);

      await stream.writeSSE({
        event: "batch:started",
        data: JSON.stringify({ batchId, totalCases: cases.length }),
      });

      const runIds: string[] = [];

      for (let i = 0; i < cases.length; i++) {
        const testCase = cases[i]!;
        const input = { query: testCase.query } as RunInput;

        // Create run record
        const [run] = await db
          .insert(runs)
          .values({
            canvasId,
            triggeredBy: user.id,
            input,
            status: "running",
            startedAt: new Date(),
            datasetId,
            batchId,
            variantLabel: variantLabel ?? null,
          })
          .returning();

        if (!run) continue;
        runIds.push(run.id);

        try {
          const stepInputMap = new Map<string, Record<string, unknown>>();

          await executeGraph(graph, input, config, async (event: AnySSEEvent) => {
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

              // Persist eval results
              const nodeType = event.data.nodeType as string | undefined;
              if (nodeType?.startsWith("eval-") && event.data.output) {
                const output = event.data.output as Record<string, unknown>;
                const score = output.score as number | undefined;
                if (score !== undefined) {
                  const metric = nodeType.replace("eval-", "").replace("-", "_");
                  await db.insert(evalResults).values({
                    runId: run.id,
                    nodeId: event.data.nodeId,
                    metric,
                    score,
                    reasoning: (output.reasoning as string) ?? null,
                    details: output.claims ?? output.perDocRelevance ?? null,
                  });
                }
              }
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
          await db
            .update(runs)
            .set({ status: "failed", completedAt: new Date() })
            .where(eq(runs.id, run.id));
        }

        // Send progress
        try {
          await stream.writeSSE({
            event: "batch:progress",
            data: JSON.stringify({
              batchId,
              completed: i + 1,
              total: cases.length,
              runId: run.id,
              query: testCase.query,
            }),
          });
        } catch {
          // Client disconnected
        }
      }

      // Fetch aggregate eval results for the batch
      const batchEvals = await db
        .select()
        .from(evalResults)
        .where(inArray(evalResults.runId, runIds));

      // Group by metric and compute aggregates
      const metricScores: Record<string, number[]> = {};
      for (const ev of batchEvals) {
        const scores = metricScores[ev.metric] ?? [];
        scores.push(ev.score);
        metricScores[ev.metric] = scores;
      }

      const aggregates: Record<string, { mean: number; p50: number; p90: number; count: number }> = {};
      for (const [metric, scores] of Object.entries(metricScores)) {
        const sorted = [...scores].sort((a, b) => a - b);
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const p50 = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
        const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? 0;
        aggregates[metric] = { mean, p50, p90, count: scores.length };
      }

      try {
        await stream.writeSSE({
          event: "batch:completed",
          data: JSON.stringify({
            batchId,
            totalCases: cases.length,
            runIds,
            aggregates,
          }),
        });
      } catch {
        // Client disconnected
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
