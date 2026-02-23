import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "@hono/node-server/vercel";
import type { AppEnv } from "./types";
import { authRoutes } from "./routes/auth";
import { organizationRoutes } from "./routes/organizations";
import { canvasRoutes } from "./routes/canvas";
import { runRoutes } from "./routes/runs";
import { documentRoutes } from "./routes/documents";
import { templateRoutes } from "./routes/templates";

const allowedOrigins = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

const app = new Hono<AppEnv>()
  .use("*", logger())
  .use(
    "*",
    cors({
      origin: allowedOrigins,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    })
  )
  .get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))
  .route("/api/auth", authRoutes)
  .route("/api/organizations", organizationRoutes)
  .route("/api/canvases", canvasRoutes)
  .route("/api/runs", runRoutes)
  .route("/api/documents", documentRoutes)
  .route("/api/templates", templateRoutes)
  .notFound((c) => c.json({ error: "Not found" }, 404))
  .onError((err, c) => {
    console.error("Server error:", err);
    return c.json({ error: "Internal server error" }, 500);
  });

// Export type for RPC client
export type AppType = typeof app;

// Vercel serverless handler — Node.js runtime adapter
export default handle(app);

// Local dev server (Bun only)
if (typeof Bun !== "undefined") {
  const port = process.env.PORT || 4000;
  Bun.serve({ fetch: app.fetch, port: Number(port) });
  console.log(`Hachi API running on http://localhost:${port}`);
}
