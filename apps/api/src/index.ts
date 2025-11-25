import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { canvasRoutes } from "./routes/canvas";
import { runRoutes } from "./routes/runs";
import { documentRoutes } from "./routes/documents";

const app = new Hono()
  .use("*", logger())
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))
  .route("/api/canvases", canvasRoutes)
  .route("/api/runs", runRoutes)
  .route("/api/documents", documentRoutes)
  .notFound((c) => c.json({ error: "Not found" }, 404))
  .onError((err, c) => {
    console.error("Server error:", err);
    return c.json({ error: "Internal server error" }, 500);
  });

// Export type for RPC client
export type AppType = typeof app;

const port = process.env.PORT || 4000;
console.log(`Hachi API running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
