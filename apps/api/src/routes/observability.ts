import { Hono } from "hono";
import { db } from "@hachi/database/client";
import { runs, spans } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { eq, and, gte, sql } from "drizzle-orm";

export const observabilityRoutes = new Hono<AppEnv>()
  // Latency percentiles by nodeType
  .get("/latency", requireAuth, async (c) => {
    const canvasId = c.req.query("canvasId");
    const days = parseInt(c.req.query("days") || "7", 10);

    if (!canvasId) {
      return c.json({ error: "canvasId query parameter required" }, 400);
    }

    const since = new Date(Date.now() - days * 86400000);

    const rows = await db
      .select({
        nodeType: spans.nodeType,
        latencyMs: spans.latencyMs,
      })
      .from(spans)
      .innerJoin(runs, eq(spans.runId, runs.id))
      .where(
        and(
          eq(runs.canvasId, canvasId),
          gte(spans.startedAt, since),
          eq(spans.status, "completed")
        )
      );

    // Group by nodeType and compute percentiles
    const grouped: Record<string, number[]> = {};
    for (const row of rows) {
      if (row.latencyMs == null) continue;
      const arr = grouped[row.nodeType] ?? [];
      arr.push(row.latencyMs);
      grouped[row.nodeType] = arr;
    }

    const result: Record<string, { p50: number; p90: number; p99: number; count: number }> = {};
    for (const [nodeType, latencies] of Object.entries(grouped)) {
      const sorted = [...latencies].sort((a, b) => a - b);
      result[nodeType] = {
        p50: sorted[Math.floor(sorted.length * 0.5)] ?? 0,
        p90: sorted[Math.floor(sorted.length * 0.9)] ?? 0,
        p99: sorted[Math.floor(sorted.length * 0.99)] ?? 0,
        count: sorted.length,
      };
    }

    return c.json({ latency: result });
  })

  // Error rate by day
  .get("/errors", requireAuth, async (c) => {
    const canvasId = c.req.query("canvasId");
    const days = parseInt(c.req.query("days") || "7", 10);

    if (!canvasId) {
      return c.json({ error: "canvasId query parameter required" }, 400);
    }

    const since = new Date(Date.now() - days * 86400000);

    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${runs.startedAt})::text`,
        total: sql<number>`count(*)::int`,
        failed: sql<number>`count(*) filter (where ${runs.status} = 'failed')::int`,
      })
      .from(runs)
      .where(
        and(
          eq(runs.canvasId, canvasId),
          gte(runs.startedAt, since)
        )
      )
      .groupBy(sql`date_trunc('day', ${runs.startedAt})`);

    const errors = rows.map((r) => ({
      day: r.day,
      total: r.total,
      failed: r.failed,
      errorRate: r.total > 0 ? r.failed / r.total : 0,
    }));

    return c.json({ errors });
  })

  // Cost/tokens by day
  .get("/costs", requireAuth, async (c) => {
    const canvasId = c.req.query("canvasId");
    const days = parseInt(c.req.query("days") || "30", 10);

    if (!canvasId) {
      return c.json({ error: "canvasId query parameter required" }, 400);
    }

    const since = new Date(Date.now() - days * 86400000);

    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${runs.startedAt})::text`,
        totalRuns: sql<number>`count(*)::int`,
        totalTokens: sql<number>`coalesce(sum(${runs.totalTokens}), 0)::int`,
        totalCost: sql<number>`coalesce(sum(${runs.totalCost}), 0)::float`,
      })
      .from(runs)
      .where(
        and(
          eq(runs.canvasId, canvasId),
          gte(runs.startedAt, since)
        )
      )
      .groupBy(sql`date_trunc('day', ${runs.startedAt})`);

    return c.json({ costs: rows });
  })

  // Get spans for a specific run
  .get("/runs/:runId/spans", requireAuth, async (c) => {
    const runId = c.req.param("runId");

    const runSpans = await db
      .select()
      .from(spans)
      .where(eq(spans.runId, runId))
      .orderBy(spans.startedAt);

    return c.json({ spans: runSpans });
  });
