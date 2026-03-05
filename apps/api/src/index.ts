import { handle } from "@hono/node-server/vercel";
import { app } from "./app";

export type { AppType } from "./app";

// Vercel serverless handler — Node.js runtime adapter
export default handle(app);
