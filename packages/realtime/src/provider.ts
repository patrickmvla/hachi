import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import type {
  CollaborationConfig,
  CollaborationEvent,
  CollaborationEventListener,
  UserAwareness,
  CursorPosition,
  UndoManagerConfig,
} from "./types";

/**
 * Collaboration Provider
 * Manages Yjs document and WebSocket connection for real-time collaboration
 */
export class CollaborationProvider {
  private doc: Y.Doc;
  private wsProvider: WebsocketProvider | null = null;
  private config: CollaborationConfig;
  private listeners: Set<CollaborationEventListener> = new Set();
  private isConnected = false;
  private isSynced = false;

  constructor(config: CollaborationConfig) {
    this.config = config;
    this.doc = new Y.Doc();
  }

  /**
   * Connect to the collaboration server
   */
  connect(): void {
    if (this.wsProvider) {
      console.warn("Already connected");
      return;
    }

    const params: Record<string, string> = {};
    if (this.config.authToken) {
      params.auth = this.config.authToken;
    }

    this.wsProvider = new WebsocketProvider(
      this.config.serverUrl,
      this.config.roomId,
      this.doc,
      { params }
    );

    // Set up awareness with user info
    this.wsProvider.awareness.setLocalStateField("user", this.config.user);
    this.wsProvider.awareness.setLocalStateField("cursor", null);
    this.wsProvider.awareness.setLocalStateField("isActive", true);
    this.wsProvider.awareness.setLocalStateField("lastActiveAt", Date.now());

    // Handle connection events
    this.wsProvider.on("status", (event: { status: string }) => {
      if (event.status === "connected") {
        this.isConnected = true;
        this.emit({ type: "connected" });
      } else if (event.status === "disconnected") {
        this.isConnected = false;
        this.emit({ type: "disconnected" });
      }
    });

    // Handle sync event
    this.wsProvider.on("sync", (synced: boolean) => {
      if (synced && !this.isSynced) {
        this.isSynced = true;
        this.emit({ type: "synced" });
      }
    });

    // Handle awareness updates
    this.wsProvider.awareness.on("change", () => {
      this.emit({
        type: "awareness-update",
        users: this.getUsers(),
      });
    });
  }

  /**
   * Disconnect from the collaboration server
   */
  disconnect(): void {
    if (this.wsProvider) {
      this.wsProvider.destroy();
      this.wsProvider = null;
      this.isConnected = false;
      this.isSynced = false;
    }
  }

  /**
   * Get the Yjs document
   */
  getDoc(): Y.Doc {
    return this.doc;
  }

  /**
   * Get a Yjs Map for storing data
   */
  getMap<T = unknown>(name: string): Y.Map<T> {
    return this.doc.getMap<T>(name);
  }

  /**
   * Get a Yjs Array for storing data
   */
  getArray<T = unknown>(name: string): Y.Array<T> {
    return this.doc.getArray<T>(name);
  }

  /**
   * Get a Yjs Text for collaborative text editing
   */
  getText(name: string): Y.Text {
    return this.doc.getText(name);
  }

  /**
   * Get a Yjs XmlFragment for XML/DOM-like structures
   */
  getXmlFragment(name: string): Y.XmlFragment {
    return this.doc.getXmlFragment(name);
  }

  /**
   * Create an UndoManager for the specified shared types
   * @param scope - Single shared type or array of shared types to track
   * @param config - Optional configuration for undo behavior
   */
  createUndoManager(
    scope: Y.AbstractType<unknown> | Y.AbstractType<unknown>[],
    config?: UndoManagerConfig
  ): Y.UndoManager {
    return new Y.UndoManager(scope, {
      captureTimeout: config?.captureTimeout ?? 500,
      trackedOrigins: config?.trackedOrigins,
      deleteFilter: config?.deleteFilter,
    });
  }

  /**
   * Update local cursor position
   */
  updateCursor(cursor: CursorPosition | null): void {
    if (this.wsProvider) {
      this.wsProvider.awareness.setLocalStateField("cursor", cursor);
      this.wsProvider.awareness.setLocalStateField("lastActiveAt", Date.now());
    }
  }

  /**
   * Set user active state
   */
  setActive(isActive: boolean): void {
    if (this.wsProvider) {
      this.wsProvider.awareness.setLocalStateField("isActive", isActive);
      if (isActive) {
        this.wsProvider.awareness.setLocalStateField("lastActiveAt", Date.now());
      }
    }
  }

  /**
   * Get all connected users with their awareness state
   */
  getUsers(): UserAwareness[] {
    if (!this.wsProvider) return [];

    const users: UserAwareness[] = [];
    const localClientId = this.wsProvider.awareness.clientID;

    this.wsProvider.awareness.getStates().forEach((state, clientId) => {
      // Skip local user
      if (clientId === localClientId) return;

      if (state.user) {
        users.push({
          user: state.user,
          cursor: state.cursor || null,
          isActive: state.isActive ?? true,
          lastActiveAt: state.lastActiveAt ?? Date.now(),
        });
      }
    });

    return users;
  }

  /**
   * Get the local user's awareness state
   */
  getLocalUser(): UserAwareness | null {
    if (!this.wsProvider) return null;

    const state = this.wsProvider.awareness.getLocalState();
    if (!state?.user) return null;

    return {
      user: state.user,
      cursor: state.cursor || null,
      isActive: state.isActive ?? true,
      lastActiveAt: state.lastActiveAt ?? Date.now(),
    };
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Check if synced
   */
  getIsSynced(): boolean {
    return this.isSynced;
  }

  /**
   * Subscribe to collaboration events
   */
  subscribe(listener: CollaborationEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: CollaborationEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
    this.doc.destroy();
  }
}
