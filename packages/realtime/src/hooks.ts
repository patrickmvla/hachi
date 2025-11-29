import { useEffect, useCallback, useMemo, useRef } from "react";
import { useStore } from "zustand";
import * as Y from "yjs";
import { CollaborationProvider } from "./provider";
import { createUserPresence, filterActiveUsers, getUsersWithCursors } from "./presence";
import {
  createCollaborationStore,
  getYMapStore,
  getYArrayStore,
  getYTextStore,
  getUndoManagerStore,
  type CollaborationStore,
  type YMapStore,
  type YArrayStore,
  type YTextStore,
  type UndoManagerStore,
  type TextDelta,
} from "./store";
import type {
  CollaborationConfig,
  UserAwareness,
  CursorPosition,
  UndoManagerConfig,
  YKeyChange,
  YArrayDelta,
} from "./types";

// Store instances cache
const collaborationStores = new Map<string, CollaborationStore>();

const getCollaborationStore = (roomId: string): CollaborationStore => {
  if (!collaborationStores.has(roomId)) {
    collaborationStores.set(roomId, createCollaborationStore());
  }
  return collaborationStores.get(roomId)!;
};

/**
 * Hook to manage collaboration provider lifecycle
 * Uses zustand for state management
 */
export const useCollaboration = (config: CollaborationConfig | null) => {
  const roomId = config?.roomId ?? "__default__";
  const store = getCollaborationStore(roomId);

  const provider = useStore(store, (s) => s.provider);
  const isConnected = useStore(store, (s) => s.isConnected);
  const isSynced = useStore(store, (s) => s.isSynced);
  const users = useStore(store, (s) => s.users);

  useEffect(() => {
    if (!config) {
      store.getState().reset();
      return;
    }

    const p = new CollaborationProvider(config);

    const unsubscribe = p.subscribe((event) => {
      switch (event.type) {
        case "connected":
          store.getState().setConnected(true);
          break;
        case "disconnected":
          store.getState().setConnected(false);
          break;
        case "synced":
          store.getState().setSynced(true);
          break;
        case "awareness-update":
          store.getState().setUsers(event.users);
          break;
      }
    });

    p.connect();
    store.getState().setProvider(p);

    return () => {
      unsubscribe();
      p.destroy();
      store.getState().reset();
    };
  }, [config?.serverUrl, config?.roomId, config?.user.id]);

  return {
    provider,
    isConnected,
    isSynced,
    users,
  };
};

/**
 * Hook to track and update cursor position
 */
export const useCursor = (provider: CollaborationProvider | null) => {
  const updateCursor = useCallback(
    (position: CursorPosition | null) => {
      provider?.updateCursor(position);
    },
    [provider]
  );

  const clearCursor = useCallback(() => {
    provider?.updateCursor(null);
  }, [provider]);

  return { updateCursor, clearCursor };
};

/**
 * Hook to get remote user cursors
 */
export const useRemoteCursors = (users: UserAwareness[]) => {
  return useMemo(() => {
    return getUsersWithCursors(users).map((u) => ({
      userId: u.user.id,
      name: u.user.name,
      color: u.user.color,
      x: u.cursor!.x,
      y: u.cursor!.y,
    }));
  }, [users]);
};

/**
 * Hook to get online presence (active users)
 */
export const usePresence = (users: UserAwareness[]) => {
  return useMemo(() => {
    const activeUsers = filterActiveUsers(users);
    return activeUsers.map((u) => ({
      id: u.user.id,
      name: u.user.name,
      color: u.user.color,
      avatarUrl: u.user.avatarUrl,
    }));
  }, [users]);
};

/**
 * Y.Map operations interface
 */
export interface YMapOperations<T> {
  /** Set a key-value pair */
  set: (key: string, value: T) => void;
  /** Delete a key */
  delete: (key: string) => void;
  /** Check if key exists */
  has: (key: string) => boolean;
  /** Get value by key */
  get: (key: string) => T | undefined;
  /** Clear all entries */
  clear: () => void;
  /** Get all keys */
  keys: () => string[];
  /** Get all values */
  values: () => T[];
  /** Get all entries */
  entries: () => [string, T][];
  /** Get number of entries */
  size: () => number;
  /** Convert to plain object */
  toJSON: () => Record<string, T>;
}

/**
 * Options for useYjsMap hook
 */
export interface UseYjsMapOptions<T> {
  /** Use observeDeep for nested change tracking */
  observeDeep?: boolean;
  /** Callback fired on each change with event details */
  onChange?: (event: {
    keysChanged: Set<string>;
    changes: Map<string, YKeyChange<T>>;
  }) => void;
}

/**
 * Hook to sync a Yjs Map with zustand store
 * Provides full Y.Map API: set, delete, has, get, clear, keys, values, entries, size, toJSON
 */
export const useYjsMap = <T>(
  provider: CollaborationProvider | null,
  mapName: string,
  options?: UseYjsMapOptions<T>
): [Map<string, T>, YMapOperations<T>] => {
  const store = getYMapStore<T>(mapName) as YMapStore<T>;
  const data = useStore(store, (s) => s.data);
  const onChangeRef = useRef(options?.onChange);
  onChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!provider) {
      store.getState().setData(new Map());
      store.getState().setYMap(null);
      return;
    }

    const yMap = provider.getMap<T>(mapName);
    store.getState().setYMap(yMap);

    // Sync initial state
    const syncState = () => {
      const newState = new Map<string, T>();
      yMap.forEach((value, key) => {
        newState.set(key, value);
      });
      store.getState().setData(newState);
    };

    syncState();

    // Listen for changes (deep or shallow)
    const observer = (event: Y.YMapEvent<T>) => {
      syncState();
      // Call onChange with typed event data
      if (onChangeRef.current) {
        const changes = new Map<string, YKeyChange<T>>();
        event.changes.keys.forEach((change, key) => {
          changes.set(key, {
            action: change.action as "add" | "update" | "delete",
            oldValue: change.oldValue as T | undefined,
          });
        });
        onChangeRef.current({
          keysChanged: event.keysChanged,
          changes,
        });
      }
    };

    if (options?.observeDeep) {
      yMap.observeDeep(observer as () => void);
    } else {
      yMap.observe(observer);
    }

    return () => {
      if (options?.observeDeep) {
        yMap.unobserveDeep(observer as () => void);
      } else {
        yMap.unobserve(observer);
      }
    };
  }, [provider, mapName, options?.observeDeep]);

  const operations: YMapOperations<T> = useMemo(() => {
    const state = store.getState();
    return {
      set: state.set,
      delete: state.delete,
      has: state.has,
      get: state.get,
      clear: state.clear,
      keys: state.keys,
      values: state.values,
      entries: state.entries,
      size: state.size,
      toJSON: state.toJSON,
    };
  }, [store]);

  return [data, operations];
};

/**
 * Y.Array operations interface
 */
export interface YArrayOperations<T> {
  /** Insert items at index */
  insert: (index: number, content: T[]) => void;
  /** Delete items starting at index */
  delete: (index: number, length?: number) => void;
  /** Push items to end */
  push: (content: T[]) => void;
  /** Add items to beginning */
  unshift: (content: T[]) => void;
  /** Get item at index */
  get: (index: number) => T | undefined;
  /** Get slice of array */
  slice: (start?: number, end?: number) => T[];
  /** Get array length */
  length: () => number;
  /** Convert to plain array */
  toArray: () => T[];
  /** Convert to JSON */
  toJSON: () => T[];
  /** Map over items */
  map: <U>(callback: (item: T, index: number) => U) => U[];
  /** ForEach over items */
  forEach: (callback: (item: T, index: number) => void) => void;
}

/**
 * Options for useYjsArray hook
 */
export interface UseYjsArrayOptions<T> {
  /** Use observeDeep for nested change tracking */
  observeDeep?: boolean;
  /** Callback fired on each change with delta details */
  onChange?: (event: {
    delta: YArrayDelta<T>[];
  }) => void;
}

/**
 * Hook to sync a Yjs Array with zustand store
 * Provides full Y.Array API: insert, delete, push, unshift, get, slice, length, toArray, toJSON, map, forEach
 */
export const useYjsArray = <T>(
  provider: CollaborationProvider | null,
  arrayName: string,
  options?: UseYjsArrayOptions<T>
): [T[], YArrayOperations<T>] => {
  const store = getYArrayStore<T>(arrayName) as YArrayStore<T>;
  const data = useStore(store, (s) => s.data);
  const onChangeRef = useRef(options?.onChange);
  onChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!provider) {
      store.getState().setData([]);
      store.getState().setYArray(null);
      return;
    }

    const yArray = provider.getArray<T>(arrayName);
    store.getState().setYArray(yArray);

    // Sync initial state
    const syncState = () => {
      store.getState().setData(yArray.toArray());
    };

    syncState();

    // Listen for changes (deep or shallow)
    const observer = (event: Y.YArrayEvent<T>) => {
      syncState();
      // Call onChange with typed delta
      if (onChangeRef.current) {
        const delta: YArrayDelta<T>[] = event.changes.delta.map((d) => ({
          insert: d.insert as T[] | undefined,
          delete: d.delete,
          retain: d.retain,
        }));
        onChangeRef.current({ delta });
      }
    };

    if (options?.observeDeep) {
      yArray.observeDeep(observer as () => void);
    } else {
      yArray.observe(observer);
    }

    return () => {
      if (options?.observeDeep) {
        yArray.unobserveDeep(observer as () => void);
      } else {
        yArray.unobserve(observer);
      }
    };
  }, [provider, arrayName, options?.observeDeep]);

  const operations: YArrayOperations<T> = useMemo(() => {
    const state = store.getState();
    return {
      insert: state.insert,
      delete: state.delete,
      push: state.push,
      unshift: state.unshift,
      get: state.get,
      slice: state.slice,
      length: state.length,
      toArray: state.toArray,
      toJSON: state.toJSON,
      map: state.map,
      forEach: state.forEach,
    };
  }, [store]);

  return [data, operations];
};

/**
 * Y.Text operations interface
 */
export interface YTextOperations {
  /** Insert text at index with optional formatting */
  insert: (index: number, content: string, format?: Record<string, unknown>) => void;
  /** Delete text from index */
  delete: (index: number, length: number) => void;
  /** Apply formatting to text range */
  format: (index: number, length: number, format: Record<string, unknown>) => void;
  /** Apply delta changes */
  applyDelta: (delta: TextDelta[]) => void;
  /** Get plain text string */
  toString: () => string;
  /** Get delta format */
  toDelta: () => TextDelta[];
  /** Get text length */
  length: () => number;
}

/**
 * Options for useYjsText hook
 */
export interface UseYjsTextOptions {
  /** Callback fired on each change with delta details */
  onChange?: (event: {
    delta: TextDelta[];
  }) => void;
}

/**
 * Hook to sync a Yjs Text with zustand store
 * Provides full Y.Text API: insert, delete, format, applyDelta, toString, toDelta, length
 */
export const useYjsText = (
  provider: CollaborationProvider | null,
  textName: string,
  options?: UseYjsTextOptions
): [string, TextDelta[], YTextOperations] => {
  const store = getYTextStore(textName) as YTextStore;
  const text = useStore(store, (s) => s.text);
  const delta = useStore(store, (s) => s.delta);
  const onChangeRef = useRef(options?.onChange);
  onChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!provider) {
      store.getState().setText("");
      store.getState().setDelta([]);
      store.getState().setYText(null);
      return;
    }

    const yText = provider.getText(textName);
    store.getState().setYText(yText);

    // Sync initial state
    const syncState = () => {
      store.getState().setText(yText.toString());
      store.getState().setDelta(yText.toDelta() as TextDelta[]);
    };

    syncState();

    // Listen for changes
    const observer = (event: Y.YTextEvent) => {
      syncState();
      // Call onChange with typed delta
      if (onChangeRef.current) {
        const eventDelta: TextDelta[] = event.delta.map((d) => ({
          insert: typeof d.insert === "string" ? d.insert : undefined,
          delete: d.delete,
          retain: d.retain,
          attributes: d.attributes as Record<string, unknown> | undefined,
        }));
        onChangeRef.current({ delta: eventDelta });
      }
    };
    yText.observe(observer);

    return () => {
      yText.unobserve(observer);
    };
  }, [provider, textName]);

  const operations: YTextOperations = useMemo(() => {
    const state = store.getState();
    return {
      insert: state.insert,
      delete: state.delete,
      format: state.format,
      applyDelta: state.applyDelta,
      toString: state.toString,
      toDelta: state.toDelta,
      length: state.length,
    };
  }, [store]);

  return [text, delta, operations];
};

/**
 * UndoManager state
 */
export interface UndoManagerState {
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Number of items in undo stack */
  undoStackSize: number;
  /** Number of items in redo stack */
  redoStackSize: number;
}

/**
 * UndoManager operations interface
 */
export interface UndoManagerOperations {
  /** Undo the last operation */
  undo: () => void;
  /** Redo a previously undone operation */
  redo: () => void;
  /** Stop merging edits into the current undo item */
  stopCapturing: () => void;
  /** Clear all undo/redo history */
  clear: () => void;
}

/**
 * Hook to manage undo/redo for Yjs shared types
 * Uses zustand for state management
 */
export const useUndoManager = (
  provider: CollaborationProvider | null,
  scope: string | string[],
  config?: UndoManagerConfig
): [UndoManagerState, UndoManagerOperations] => {
  const scopeKey = Array.isArray(scope) ? scope.join(":") : scope;
  const store = getUndoManagerStore(scopeKey) as UndoManagerStore;

  const canUndo = useStore(store, (s) => s.canUndo);
  const canRedo = useStore(store, (s) => s.canRedo);
  const undoStackSize = useStore(store, (s) => s.undoStackSize);
  const redoStackSize = useStore(store, (s) => s.redoStackSize);

  useEffect(() => {
    if (!provider) {
      store.getState().setState({
        canUndo: false,
        canRedo: false,
        undoStackSize: 0,
        redoStackSize: 0,
      });
      store.getState().setUndoManager(null);
      return;
    }

    // Get the shared types to track
    const scopes = Array.isArray(scope) ? scope : [scope];
    const sharedTypes = scopes.map((name) => provider.getMap(name) as Y.AbstractType<unknown>);

    // Create the undo manager
    const undoManager = provider.createUndoManager(sharedTypes, config);
    store.getState().setUndoManager(undoManager);

    // Update state helper
    const updateState = () => {
      store.getState().setState({
        canUndo: undoManager.undoStack.length > 0,
        canRedo: undoManager.redoStack.length > 0,
        undoStackSize: undoManager.undoStack.length,
        redoStackSize: undoManager.redoStack.length,
      });
    };

    // Listen for stack changes
    undoManager.on("stack-item-added", updateState);
    undoManager.on("stack-item-popped", updateState);
    undoManager.on("stack-item-updated", updateState);

    // Initial state
    updateState();

    return () => {
      undoManager.destroy();
      store.getState().setUndoManager(null);
    };
  }, [provider, JSON.stringify(scope), config?.captureTimeout]);

  const state: UndoManagerState = { canUndo, canRedo, undoStackSize, redoStackSize };

  const operations: UndoManagerOperations = useMemo(() => {
    const s = store.getState();
    return {
      undo: s.undo,
      redo: s.redo,
      stopCapturing: s.stopCapturing,
      clear: s.clear,
    };
  }, [store]);

  return [state, operations];
};

/**
 * Create collaboration config from user session
 */
export const createCollaborationConfig = (
  serverUrl: string,
  roomId: string,
  user: { id: string; name: string; email: string; avatarUrl?: string },
  authToken?: string
): CollaborationConfig => ({
  serverUrl,
  roomId,
  user: createUserPresence(user),
  authToken,
});

/**
 * Direct store access for non-React usage
 */
export {
  getYMapStore,
  getYArrayStore,
  getYTextStore,
  getUndoManagerStore,
  clearAllStores,
} from "./store";
