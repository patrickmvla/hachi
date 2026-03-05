import { app } from "./app";

const port = process.env.PORT || 4000;
Bun.serve({ fetch: app.fetch, port: Number(port) });
console.log(`Hachi API running on http://localhost:${port}`);
