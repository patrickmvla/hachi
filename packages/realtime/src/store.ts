import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as Y from "yjs";
import type { CollaborationProvider } from "./provider";
import type { UserAwareness } from "./types";

/**
 * Text delta format (compatible with Quill)
 */
export interface TextDelta {
  insert?: string;
  delete?: number;
  retain?: number;
  attributes?: Record<string, unknown>;
}

/**
 * UndoManager state
 */
export interface UndoManagerState {
  canUndo: boolean;
  canRedo: boolean;
  undoStackSize: number;
  redoStackSize: number;
}

/**
 * Collaboration store state
 */
export interface CollaborationState {
  provider: CollaborationProvider | null;
  isConnected: boolean;
  isSynced: boolean;
  users: UserAwareness[];

  // Actions
  setProvider: (provider: CollaborationProvider | null) => void;
  setConnected: (connected: boolean) => void;
  setSynced: (synced: boolean) => void;
  setUsers: (users: UserAwareness[]) => void;
  reset: () => void;
}

/**
 * Create a collaboration store
 */
export const createCollaborationStore = () =>
  create<CollaborationState>()(
    subscribeWithSelector((set) => ({
      provider: null,
      isConnected: false,
      isSynced: false,
      users: [],

      setProvider: (provider) => set({ provider }),
      setConnected: (isConnected) => set({ isConnected }),
      setSynced: (isSynced) => set({ isSynced }),
      setUsers: (users) => set({ users }),
      reset: () => set({ provider: null, isConnected: false, isSynced: false, users: [] }),
    }))
  );

export type CollaborationStore = ReturnType<typeof createCollaborationStore>;

/**
 * Y.Map store state
 */
export interface YMapState<T> {
  data: Map<string, T>;
  yMap: Y.Map<T> | null;

  // Actions
  setData: (data: Map<string, T>) => void;
  setYMap: (yMap: Y.Map<T> | null) => void;

  // Y.Map operations
  set: (key: string, value: T) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  get: (key: string) => T | undefined;
  clear: () => void;
  keys: () => string[];
  values: () => T[];
  entries: () => [string, T][];
  size: () => number;
  toJSON: () => Record<string, T>;
}

/**
 * Create a Y.Map store
 */
export const createYMapStore = <T>() =>
  create<YMapState<T>>()(
    subscribeWithSelector((set, get) => ({
      data: new Map(),
      yMap: null,

      setData: (data) => set({ data }),
      setYMap: (yMap) => set({ yMap }),

      // Y.Map operations
      set: (key, value) => {
        get().yMap?.set(key, value);
      },
      delete: (key) => {
        get().yMap?.delete(key);
      },
      has: (key) => {
        return get().yMap?.has(key) ?? false;
      },
      get: (key) => {
        return get().yMap?.get(key);
      },
      clear: () => {
        get().yMap?.clear();
      },
      keys: () => {
        const yMap = get().yMap;
        return yMap ? Array.from(yMap.keys()) : [];
      },
      values: () => {
        const yMap = get().yMap;
        return yMap ? Array.from(yMap.values()) : [];
      },
      entries: () => {
        const yMap = get().yMap;
        return yMap ? Array.from(yMap.entries()) : [];
      },
      size: () => {
        return get().yMap?.size ?? 0;
      },
      toJSON: () => {
        return (get().yMap?.toJSON() as Record<string, T>) ?? {};
      },
    }))
  );

export type YMapStore<T> = ReturnType<typeof createYMapStore<T>>;

/**
 * Y.Array store state
 */
export interface YArrayState<T> {
  data: T[];
  yArray: Y.Array<T> | null;

  // Actions
  setData: (data: T[]) => void;
  setYArray: (yArray: Y.Array<T> | null) => void;

  // Y.Array operations
  insert: (index: number, content: T[]) => void;
  delete: (index: number, length?: number) => void;
  push: (content: T[]) => void;
  unshift: (content: T[]) => void;
  get: (index: number) => T | undefined;
  slice: (start?: number, end?: number) => T[];
  length: () => number;
  toArray: () => T[];
  toJSON: () => T[];
  map: <U>(callback: (item: T, index: number) => U) => U[];
  forEach: (callback: (item: T, index: number) => void) => void;
}

/**
 * Create a Y.Array store
 */
export const createYArrayStore = <T>() =>
  create<YArrayState<T>>()(
    subscribeWithSelector((set, get) => ({
      data: [],
      yArray: null,

      setData: (data) => set({ data }),
      setYArray: (yArray) => set({ yArray }),

      // Y.Array operations
      insert: (index, content) => {
        get().yArray?.insert(index, content);
      },
      delete: (index, length = 1) => {
        get().yArray?.delete(index, length);
      },
      push: (content) => {
        get().yArray?.push(content);
      },
      unshift: (content) => {
        get().yArray?.unshift(content);
      },
      get: (index) => {
        return get().yArray?.get(index);
      },
      slice: (start, end) => {
        return get().yArray?.slice(start, end) ?? [];
      },
      length: () => {
        return get().yArray?.length ?? 0;
      },
      toArray: () => {
        return get().yArray?.toArray() ?? [];
      },
      toJSON: () => {
        return (get().yArray?.toJSON() as T[]) ?? [];
      },
      map: (callback) => {
        return get().yArray?.map(callback) ?? [];
      },
      forEach: (callback) => {
        get().yArray?.forEach(callback);
      },
    }))
  );

export type YArrayStore<T> = ReturnType<typeof createYArrayStore<T>>;

/**
 * Y.Text store state
 */
export interface YTextState {
  text: string;
  delta: TextDelta[];
  yText: Y.Text | null;

  // Actions
  setText: (text: string) => void;
  setDelta: (delta: TextDelta[]) => void;
  setYText: (yText: Y.Text | null) => void;

  // Y.Text operations
  insert: (index: number, content: string, format?: Record<string, unknown>) => void;
  delete: (index: number, length: number) => void;
  format: (index: number, length: number, format: Record<string, unknown>) => void;
  applyDelta: (delta: TextDelta[]) => void;
  toString: () => string;
  toDelta: () => TextDelta[];
  length: () => number;
}

/**
 * Create a Y.Text store
 */
export const createYTextStore = () =>
  create<YTextState>()(
    subscribeWithSelector((set, get) => ({
      text: "",
      delta: [],
      yText: null,

      setText: (text) => set({ text }),
      setDelta: (delta) => set({ delta }),
      setYText: (yText) => set({ yText }),

      // Y.Text operations
      insert: (index, content, format) => {
        get().yText?.insert(index, content, format);
      },
      delete: (index, length) => {
        get().yText?.delete(index, length);
      },
      format: (index, length, format) => {
        get().yText?.format(index, length, format);
      },
      applyDelta: (delta) => {
        get().yText?.applyDelta(delta);
      },
      toString: () => {
        return get().yText?.toString() ?? "";
      },
      toDelta: () => {
        return (get().yText?.toDelta() as TextDelta[]) ?? [];
      },
      length: () => {
        return get().yText?.length ?? 0;
      },
    }))
  );

export type YTextStore = ReturnType<typeof createYTextStore>;

/**
 * UndoManager store state
 */
export interface UndoManagerStoreState extends UndoManagerState {
  undoManager: Y.UndoManager | null;

  // Actions
  setState: (state: UndoManagerState) => void;
  setUndoManager: (undoManager: Y.UndoManager | null) => void;

  // Operations
  undo: () => void;
  redo: () => void;
  stopCapturing: () => void;
  clear: () => void;
}

/**
 * Create an UndoManager store
 */
export const createUndoManagerStore = () =>
  create<UndoManagerStoreState>()(
    subscribeWithSelector((set, get) => ({
      canUndo: false,
      canRedo: false,
      undoStackSize: 0,
      redoStackSize: 0,
      undoManager: null,

      setState: (state) => set(state),
      setUndoManager: (undoManager) => set({ undoManager }),

      // Operations
      undo: () => {
        get().undoManager?.undo();
      },
      redo: () => {
        get().undoManager?.redo();
      },
      stopCapturing: () => {
        get().undoManager?.stopCapturing();
      },
      clear: () => {
        get().undoManager?.clear();
      },
    }))
  );

export type UndoManagerStore = ReturnType<typeof createUndoManagerStore>;

/**
 * Global stores cache for reusing stores by name
 * Using 'any' for the cache to allow generic type flexibility
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStores = new Map<string, YMapStore<any>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrayStores = new Map<string, YArrayStore<any>>();
const textStores = new Map<string, YTextStore>();
const undoStores = new Map<string, UndoManagerStore>();

/**
 * Get or create a Y.Map store by name
 */
export const getYMapStore = <T>(name: string): YMapStore<T> => {
  if (!mapStores.has(name)) {
    mapStores.set(name, createYMapStore<T>() as YMapStore<T>);
  }
  return mapStores.get(name) as YMapStore<T>;
};

/**
 * Get or create a Y.Array store by name
 */
export const getYArrayStore = <T>(name: string): YArrayStore<T> => {
  if (!arrayStores.has(name)) {
    arrayStores.set(name, createYArrayStore<T>() as YArrayStore<T>);
  }
  return arrayStores.get(name) as YArrayStore<T>;
};

/**
 * Get or create a Y.Text store by name
 */
export const getYTextStore = (name: string): YTextStore => {
  if (!textStores.has(name)) {
    textStores.set(name, createYTextStore());
  }
  return textStores.get(name)!;
};

/**
 * Get or create an UndoManager store by scope
 */
export const getUndoManagerStore = (scope: string): UndoManagerStore => {
  if (!undoStores.has(scope)) {
    undoStores.set(scope, createUndoManagerStore());
  }
  return undoStores.get(scope)!;
};

/**
 * Clear all stores (useful for cleanup/testing)
 */
export const clearAllStores = () => {
  mapStores.clear();
  arrayStores.clear();
  textStores.clear();
  undoStores.clear();
};
