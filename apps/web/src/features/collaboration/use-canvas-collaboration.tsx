"use client";

import { useEffect, useMemo, useCallback, useState, createContext, useContext, type ReactNode } from "react";
import {
  useCollaboration,
  useCursor,
  useRemoteCursors,
  usePresence,
  createCollaborationConfig,
  type CollaborationConfig,
  type UserAwareness,
} from "@hachi/realtime";

// Server URL for WebSocket connection (can be configured via env)
const WS_SERVER_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4001";

interface CollaborationContextValue {
  isConnected: boolean;
  isSynced: boolean;
  users: Array<{ id: string; name: string; color: string; avatarUrl?: string }>;
  cursors: Array<{ userId: string; name: string; color: string; x: number; y: number }>;
  updateCursor: (position: { x: number; y: number } | null) => void;
  currentUser: { id: string; name: string; email: string } | null;
}

const CollaborationContext = createContext<CollaborationContextValue | null>(null);

interface CollaborationProviderProps {
  children: ReactNode;
  canvasId: string;
  user: { id: string; name: string; email: string; avatarUrl?: string } | null;
  enabled?: boolean;
}

export const CollaborationProvider = ({
  children,
  canvasId,
  user,
  enabled = true,
}: CollaborationProviderProps) => {
  const [remoteUsers, setRemoteUsers] = useState<UserAwareness[]>([]);

  // Create collaboration config only when we have user and canvasId
  const config = useMemo<CollaborationConfig | null>(() => {
    if (!enabled || !user || !canvasId) return null;

    return createCollaborationConfig(WS_SERVER_URL, `canvas-${canvasId}`, user);
  }, [enabled, user, canvasId]);

  const { provider, isConnected, isSynced, users: awarenessUsers } = useCollaboration(config);
  const { updateCursor: setCursor, clearCursor } = useCursor(provider);

  // Update remote users when awareness changes
  useEffect(() => {
    setRemoteUsers(awarenessUsers);
  }, [awarenessUsers]);

  // Get presence (online users without cursor data)
  const presenceUsers = usePresence(remoteUsers);

  // Get remote cursors
  const remoteCursors = useRemoteCursors(remoteUsers);

  // Wrapper for updateCursor to handle flow coordinates
  const updateCursor = useCallback(
    (position: { x: number; y: number } | null) => {
      if (position) {
        setCursor({ x: position.x, y: position.y });
      } else {
        clearCursor();
      }
    },
    [setCursor, clearCursor]
  );

  // Clear cursor when component unmounts or user leaves
  useEffect(() => {
    return () => {
      clearCursor();
    };
  }, [clearCursor]);

  const value: CollaborationContextValue = {
    isConnected,
    isSynced,
    users: presenceUsers,
    cursors: remoteCursors,
    updateCursor,
    currentUser: user,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCanvasCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    // Return a default value when not in collaboration mode
    return {
      isConnected: false,
      isSynced: false,
      users: [],
      cursors: [],
      updateCursor: () => {},
      currentUser: null,
    };
  }
  return context;
};
