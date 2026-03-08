import type { AnySSEEvent } from "@hachi/schemas/execution";
import { broadcastToRoom, scheduleRoomCleanup } from "./server";

/**
 * Creates a debug bridge that wraps an onEvent callback to also
 * broadcast events to a debug WebSocket room.
 */
export function createDebugBridge(
  runId: string,
  onEvent: (event: AnySSEEvent) => void | Promise<void>
): (event: AnySSEEvent) => void | Promise<void> {
  return async (event: AnySSEEvent) => {
    // Forward to original handler
    await onEvent(event);

    // Broadcast to debug room
    broadcastToRoom(runId, event as unknown as Record<string, unknown>);

    // Schedule cleanup when run ends
    if (event.type === "run:completed" || event.type === "run:failed") {
      scheduleRoomCleanup(runId);
    }
  };
}
