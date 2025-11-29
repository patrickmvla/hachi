import type * as Y from "yjs";

/**
 * User presence information for real-time collaboration
 */
export interface UserPresence {
  id: string;
  name: string;
  email: string;
  /** Hex color for cursor/presence display (e.g., '#ffb61e') */
  color: string;
  avatarUrl?: string;
}

/**
 * Cursor position on canvas
 */
export interface CursorPosition {
  x: number;
  y: number;
  viewportX?: number;
  viewportY?: number;
}

/**
 * User awareness state (presence + cursor)
 */
export interface UserAwareness {
  user: UserPresence;
  cursor: CursorPosition | null;
  isActive: boolean;
  lastActiveAt: number;
}

/**
 * Canvas collaboration state stored in Yjs
 */
export interface CanvasYjsState {
  nodes: Y.Map<unknown>;
  edges: Y.Map<unknown>;
  viewport: Y.Map<unknown>;
}

/**
 * Collaboration provider configuration
 */
export interface CollaborationConfig {
  /** WebSocket server URL */
  serverUrl: string;
  /** Room/document identifier (typically canvas ID) */
  roomId: string;
  /** Current user information */
  user: UserPresence;
  /** Optional auth token for WebSocket connection */
  authToken?: string;
}

/**
 * Collaboration events
 */
export type CollaborationEvent =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "synced" }
  | { type: "awareness-update"; users: UserAwareness[] }
  | { type: "error"; error: Error };

/**
 * Collaboration event listener
 */
export type CollaborationEventListener = (event: CollaborationEvent) => void;

/**
 * UndoManager configuration options
 */
export interface UndoManagerConfig {
  /** Milliseconds to wait before capturing a new undo item (default: 500) */
  captureTimeout?: number;
  /** Set of transaction origins to track */
  trackedOrigins?: Set<unknown>;
  /** Filter function to determine which deleted items to track */
  deleteFilter?: (item: unknown) => boolean;
}

/**
 * UndoManager stack item event
 */
export interface UndoManagerStackEvent {
  stackItem: {
    meta: Map<string, unknown>;
  };
  origin: unknown;
  type: "undo" | "redo";
  changedParentTypes: Map<unknown, unknown[]>;
}

/**
 * Base Y.Event properties shared across all event types
 */
export interface YEventBase<T = unknown> {
  /** The shared type where the event originated */
  target: T;
  /** Current target as event traverses callbacks */
  currentTarget: T;
  /** Path from Y.Doc to the changed type */
  path: (string | number)[];
}

/**
 * Key change action types
 */
export type YKeyChangeAction = "add" | "update" | "delete";

/**
 * Key change information for Y.Map and Y.Xml attributes
 */
export interface YKeyChange<T = unknown> {
  action: YKeyChangeAction;
  oldValue?: T;
}

/**
 * Delta operation for arrays (insert/delete/retain)
 */
export interface YArrayDelta<T = unknown> {
  insert?: T[];
  delete?: number;
  retain?: number;
}

/**
 * Y.MapEvent - fired when a Y.Map is modified
 */
export interface YMapEvent<T = unknown> extends YEventBase {
  /** Set of keys that were modified */
  keysChanged: Set<string>;
  /** Detailed changes per key */
  changes: {
    keys: Map<string, YKeyChange<T>>;
  };
}

/**
 * Y.ArrayEvent - fired when a Y.Array is modified
 */
export interface YArrayEvent<T = unknown> extends YEventBase {
  /** Changes in delta format */
  changes: {
    delta: YArrayDelta<T>[];
  };
}

/**
 * Y.TextEvent - fired when a Y.Text is modified
 */
export interface YTextEvent extends YEventBase {
  /** Changes in text delta format (Quill-compatible) */
  changes: {
    delta: Array<{
      insert?: string;
      delete?: number;
      retain?: number;
      attributes?: Record<string, unknown>;
    }>;
  };
}

/**
 * Y.XmlEvent - fired when Y.XmlElement/XmlFragment is modified
 */
export interface YXmlEvent extends YEventBase {
  /** Set of attribute names that changed */
  attributesChanged: Set<string>;
  /** Child element changes */
  childListChanged: boolean;
  /** Detailed changes */
  changes: {
    keys: Map<string, YKeyChange>;
    delta: YArrayDelta[];
  };
}
