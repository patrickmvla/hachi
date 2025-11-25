import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const executeRunSchema = z.object({
  canvasId: z.string().uuid(),
  input: z.record(z.unknown()),
});

export const runRoutes = new Hono()
  .get("/", async (c) => {
    const canvasId = c.req.query("canvasId");
    // TODO: Fetch from database
    return c.json({ runs: [] });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    // TODO: Fetch from database
    return c.json({ id, status: "pending", stepOutputs: [] });
  })
  .post("/execute", zValidator("json", executeRunSchema), async (c) => {
    const { canvasId, input } = c.req.valid("json");

    return streamSSE(c, async (stream) => {
      const runId = crypto.randomUUID();

      await stream.writeSSE({
        event: "run:started",
        data: JSON.stringify({ runId, canvasId }),
      });

      // TODO: Execute Mastra workflow and stream step outputs
      await stream.writeSSE({
        event: "run:completed",
        data: JSON.stringify({ runId, status: "completed" }),
      });
    });
  })
  .get("/:runId/steps/:nodeId", async (c) => {
    const runId = c.req.param("runId");
    const nodeId = c.req.param("nodeId");
    // TODO: Fetch from database/cache (Wire Tap)
    return c.json({ runId, nodeId, input: {}, output: {}, latencyMs: 0 });
  });
