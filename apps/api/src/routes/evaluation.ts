import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { testDatasets, testCases, evalResults, evalThresholds, runs } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireOrganization } from "../middleware/organization";
import { eq, and, inArray } from "drizzle-orm";

export const evaluationRoutes = new Hono<AppEnv>()
  // List test datasets for org
  .get("/datasets", requireAuth, requireOrganization, async (c) => {
    const organizationId = c.get("organizationId");

    const datasets = await db
      .select()
      .from(testDatasets)
      .where(eq(testDatasets.organizationId, organizationId))
      .orderBy(testDatasets.createdAt);

    // Get case counts for each dataset
    const datasetsWithCounts = await Promise.all(
      datasets.map(async (ds) => {
        const cases = await db
          .select()
          .from(testCases)
          .where(eq(testCases.datasetId, ds.id));
        return { ...ds, caseCount: cases.length };
      })
    );

    return c.json({ datasets: datasetsWithCounts });
  })

  // Create test dataset
  .post("/datasets", requireAuth, requireOrganization, zValidator("json", z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  })), async (c) => {
    const { name, description } = c.req.valid("json");
    const organizationId = c.get("organizationId");
    const user = c.get("user");

    const [dataset] = await db
      .insert(testDatasets)
      .values({
        organizationId,
        name,
        description: description ?? null,
        createdBy: user.id,
      })
      .returning();

    return c.json({ dataset }, 201);
  })

  // Get dataset with cases
  .get("/datasets/:id", requireAuth, requireOrganization, async (c) => {
    const id = c.req.param("id");
    const organizationId = c.get("organizationId");

    const [dataset] = await db
      .select()
      .from(testDatasets)
      .where(and(eq(testDatasets.id, id), eq(testDatasets.organizationId, organizationId)))
      .limit(1);

    if (!dataset) {
      return c.json({ error: "Dataset not found" }, 404);
    }

    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.datasetId, id))
      .orderBy(testCases.createdAt);

    return c.json({ dataset, cases });
  })

  // Delete dataset
  .delete("/datasets/:id", requireAuth, requireOrganization, async (c) => {
    const id = c.req.param("id");
    const organizationId = c.get("organizationId");

    await db
      .delete(testDatasets)
      .where(and(eq(testDatasets.id, id), eq(testDatasets.organizationId, organizationId)));

    return c.json({ success: true });
  })

  // Add test cases (bulk)
  .post("/datasets/:id/cases", requireAuth, zValidator("json", z.object({
    cases: z.array(z.object({
      query: z.string().min(1),
      groundTruth: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })),
  })), async (c) => {
    const datasetId = c.req.param("id");
    const { cases } = c.req.valid("json");

    const inserted = await db
      .insert(testCases)
      .values(
        cases.map((tc) => ({
          datasetId,
          query: tc.query,
          groundTruth: tc.groundTruth ?? null,
          metadata: tc.metadata ?? null,
        }))
      )
      .returning();

    return c.json({ cases: inserted }, 201);
  })

  // Delete a test case
  .delete("/cases/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    await db.delete(testCases).where(eq(testCases.id, id));
    return c.json({ success: true });
  })

  // Get eval thresholds for a canvas
  .get("/thresholds/:canvasId", requireAuth, async (c) => {
    const canvasId = c.req.param("canvasId");

    const thresholds = await db
      .select()
      .from(evalThresholds)
      .where(eq(evalThresholds.canvasId, canvasId));

    return c.json({ thresholds });
  })

  // Set eval threshold
  .post("/thresholds", requireAuth, zValidator("json", z.object({
    canvasId: z.string().uuid(),
    metric: z.string(),
    threshold: z.number().min(0).max(1),
  })), async (c) => {
    const { canvasId, metric, threshold } = c.req.valid("json");

    // Upsert: delete existing + insert
    await db
      .delete(evalThresholds)
      .where(and(eq(evalThresholds.canvasId, canvasId), eq(evalThresholds.metric, metric)));

    const [result] = await db
      .insert(evalThresholds)
      .values({ canvasId, metric, threshold })
      .returning();

    return c.json({ threshold: result });
  })

  // Get batch results with aggregated eval scores
  .get("/batches/:batchId", requireAuth, async (c) => {
    const batchId = c.req.param("batchId");

    const batchRuns = await db
      .select()
      .from(runs)
      .where(eq(runs.batchId, batchId))
      .orderBy(runs.startedAt);

    if (batchRuns.length === 0) {
      return c.json({ error: "Batch not found" }, 404);
    }

    const runIds = batchRuns.map((r) => r.id);
    const evals = await db
      .select()
      .from(evalResults)
      .where(inArray(evalResults.runId, runIds));

    // Group by metric
    const metricScores: Record<string, number[]> = {};
    for (const ev of evals) {
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

    return c.json({ runs: batchRuns, evalResults: evals, aggregates });
  });
