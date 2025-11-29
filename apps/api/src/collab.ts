/**
 * Collaboration WebSocket Server
 * Handles real-time Yjs document synchronization
 *
 * Run with: bun run apps/api/src/collab.ts
 */

import {
  createCollaborationServer,
  setPersistence,
  createDatabasePersistence,
  createMemoryPersistence,
  getCollaborationStats,
} from "./services/collaboration";

const port = parseInt(process.env.COLLAB_PORT || "4001");
const useDatabasePersistence = process.env.COLLAB_PERSISTENCE !== "memory";

// Setup persistence
if (useDatabasePersistence) {
  console.log("[Collab] Using database persistence");
  setPersistence(createDatabasePersistence());
} else {
  console.log("[Collab] Using in-memory persistence");
  setPersistence(createMemoryPersistence());
}

// Start the server
const server = createCollaborationServer(port);

console.log(`[Collab] Collaboration server running on ws://localhost:${port}`);
console.log(`[Collab] Health check: http://localhost:${port}/health`);
console.log(`[Collab] Connect to room: ws://localhost:${port}/rooms/{roomName}`);

// Log stats periodically
setInterval(() => {
  const stats = getCollaborationStats();
  if (stats.totalConnections > 0) {
    console.log(
      `[Collab] Stats: ${stats.totalDocs} docs, ${stats.totalConnections} connections`
    );
  }
}, 30000);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[Collab] Shutting down...");
  server.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("[Collab] Received SIGTERM, shutting down...");
  server.stop();
  process.exit(0);
});
