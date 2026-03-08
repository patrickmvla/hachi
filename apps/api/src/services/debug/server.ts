import type { ServerWebSocket } from "bun";

/**
 * Debug WebSocket Server
 * Room-based debugging: clients subscribe to a runId and receive
 * buffered + live execution events.
 */

interface DebugRoom {
  clients: Set<ServerWebSocket<DebugSocketData>>;
  events: string[]; // buffered events as JSON strings
}

interface DebugSocketData {
  subscribedRunId: string | null;
}

const rooms = new Map<string, DebugRoom>();

function getOrCreateRoom(runId: string): DebugRoom {
  let room = rooms.get(runId);
  if (!room) {
    room = { clients: new Set(), events: [] };
    rooms.set(runId, room);
  }
  return room;
}

/**
 * Broadcasts an event to all clients in a debug room.
 * Also buffers the event for late-joining clients.
 */
export function broadcastToRoom(runId: string, event: Record<string, unknown>) {
  const room = rooms.get(runId);
  if (!room) return;

  const json = JSON.stringify(event);
  room.events.push(json);

  for (const ws of room.clients) {
    try {
      ws.send(json);
    } catch {
      // Client disconnected
    }
  }
}

/**
 * Cleans up a debug room after a run completes.
 * Keeps the room for 5 minutes to allow replay.
 */
export function scheduleRoomCleanup(runId: string) {
  setTimeout(() => {
    rooms.delete(runId);
  }, 5 * 60 * 1000);
}

/**
 * Creates a Bun WebSocket debug server on the specified port.
 */
export function createDebugServer(port = 4002) {
  return Bun.serve<DebugSocketData>({
    port,
    fetch(req, server) {
      const url = new URL(req.url);

      if (url.pathname === "/health") {
        return new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const upgraded = server.upgrade(req, {
        data: { subscribedRunId: null },
      });

      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
    },
    websocket: {
      open(ws) {
        // Connection opened, waiting for subscribe message
      },

      message(ws, message) {
        try {
          const msg = JSON.parse(String(message));

          switch (msg.type) {
            case "subscribe": {
              const runId = msg.runId as string;
              if (!runId) return;

              // Unsubscribe from previous room
              if (ws.data.subscribedRunId) {
                const prevRoom = rooms.get(ws.data.subscribedRunId);
                prevRoom?.clients.delete(ws);
              }

              const room = getOrCreateRoom(runId);
              room.clients.add(ws);
              ws.data.subscribedRunId = runId;

              // Replay buffered events
              for (const event of room.events) {
                ws.send(event);
              }

              ws.send(JSON.stringify({ type: "subscribed", runId }));
              break;
            }

            case "unsubscribe": {
              if (ws.data.subscribedRunId) {
                const room = rooms.get(ws.data.subscribedRunId);
                room?.clients.delete(ws);
                ws.data.subscribedRunId = null;
              }
              break;
            }

            case "ping": {
              ws.send(JSON.stringify({ type: "pong" }));
              break;
            }
          }
        } catch {
          // Invalid message
        }
      },

      close(ws) {
        if (ws.data.subscribedRunId) {
          const room = rooms.get(ws.data.subscribedRunId);
          room?.clients.delete(ws);
        }
      },
    },
  });
}
