import { Hono } from "hono";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { nodeRegistry } from "../services/nodes/registry";

export const nodeRoutes = new Hono<AppEnv>()
  // List all registered node types
  .get("/", requireAuth, async (c) => {
    const nodes = nodeRegistry.getAll();
    return c.json({ nodes });
  });
