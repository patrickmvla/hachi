"use client";

import { useState, useRef, useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { handleSSEEvent } from "./event-dispatcher";

interface UseDebugConnectionOptions {
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useDebugConnection(options?: UseDebugConnectionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback((url: string, runId: string) => {
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        // Subscribe to the run
        ws.send(JSON.stringify({ type: "subscribe", runId }));

        // Reset stores for new debug session
        const canvasStore = useCanvasStore.getState();
        const logStore = useExecutionLogStore.getState();
        canvasStore.clearAllNodeStatuses();
        logStore.clear();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "subscribed") {
            setIsConnected(true);
            options?.onConnected?.();
            return;
          }

          if (data.type === "pong") return;

          // Dispatch through shared event handler
          handleSSEEvent(data);
        } catch {
          // Invalid message
        }
      };

      ws.onerror = () => {
        setConnectionError("Connection failed");
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        options?.onDisconnected?.();
      };
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : "Failed to connect");
    }
  }, [options]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe" }));
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return { isConnected, connectionError, connect, disconnect };
}
