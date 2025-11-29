import * as Y from "yjs";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import * as observable from "lib0/observable";
import * as map from "lib0/map";
import * as eventloop from "lib0/eventloop";

/**
 * Document Update Utilities
 * For encoding, decoding, and syncing document state
 */

/**
 * Encode the entire document state as a binary update
 * @param doc - The Yjs document
 * @param targetStateVector - Optional state vector to diff against (returns only missing changes)
 */
export const encodeDocumentState = (
  doc: Y.Doc,
  targetStateVector?: Uint8Array
): Uint8Array => {
  return Y.encodeStateAsUpdate(doc, targetStateVector);
};

/**
 * Apply a binary update to a document
 * @param doc - The Yjs document
 * @param update - Binary update data
 * @param origin - Optional transaction origin for tracking
 */
export const applyDocumentUpdate = (
  doc: Y.Doc,
  update: Uint8Array,
  origin?: unknown
): void => {
  Y.applyUpdate(doc, update, origin);
};

/**
 * Get the state vector of a document (describes current state for efficient syncing)
 * @param doc - The Yjs document
 */
export const getStateVector = (doc: Y.Doc): Uint8Array => {
  return Y.encodeStateVector(doc);
};

/**
 * Merge multiple updates into one (removes duplicates, results in smaller update)
 * @param updates - Array of binary updates
 */
export const mergeUpdates = (updates: Uint8Array[]): Uint8Array => {
  return Y.mergeUpdates(updates);
};

/**
 * Compute the difference between an update and a state vector
 * @param update - The full update
 * @param stateVector - The target state vector
 */
export const diffUpdate = (
  update: Uint8Array,
  stateVector: Uint8Array
): Uint8Array => {
  return Y.diffUpdate(update, stateVector);
};

/**
 * Extract state vector from an update without loading the document
 * @param update - Binary update data
 */
export const getStateVectorFromUpdate = (update: Uint8Array): Uint8Array => {
  return Y.encodeStateVectorFromUpdate(update);
};

/**
 * Relative Position Utilities
 * For stable cursor/selection tracking across document changes
 */

export interface RelativePosition {
  type: Y.ID | null;
  tname: string | null;
  item: Y.ID | null;
  assoc: number;
}

export interface AbsolutePosition {
  type: Y.AbstractType<unknown>;
  index: number;
  assoc: number;
}

/**
 * Create a relative position from an index in a shared type
 * Relative positions remain stable across document changes
 * @param type - The shared type (Y.Text, Y.Array, etc.)
 * @param index - The index position
 * @param assoc - Association direction (>=0 for following, <0 for preceding)
 */
export const createRelativePosition = (
  type: Y.AbstractType<unknown>,
  index: number,
  assoc = 0
): Y.RelativePosition => {
  return Y.createRelativePositionFromTypeIndex(type, index, assoc);
};

/**
 * Convert a relative position back to an absolute index
 * @param relPos - The relative position
 * @param doc - The Yjs document
 * @returns Absolute position or null if invalid/deleted
 */
export const toAbsolutePosition = (
  relPos: Y.RelativePosition,
  doc: Y.Doc
): AbsolutePosition | null => {
  return Y.createAbsolutePositionFromRelativePosition(relPos, doc);
};

/**
 * Encode a relative position to binary for storage/transmission
 * @param relPos - The relative position
 */
export const encodeRelativePosition = (
  relPos: Y.RelativePosition
): Uint8Array => {
  return Y.encodeRelativePosition(relPos);
};

/**
 * Decode a relative position from binary
 * @param data - Binary encoded relative position
 */
export const decodeRelativePosition = (
  data: Uint8Array
): Y.RelativePosition => {
  return Y.decodeRelativePosition(data);
};

/**
 * Encode a relative position to JSON string
 * @param relPos - The relative position
 */
export const relativePositionToJSON = (relPos: Y.RelativePosition): string => {
  return JSON.stringify(relPos);
};

/**
 * Decode a relative position from JSON string
 * @param json - JSON encoded relative position
 */
export const relativePositionFromJSON = (json: string): Y.RelativePosition => {
  return JSON.parse(json) as Y.RelativePosition;
};

/**
 * Subdocument Utilities
 * For managing nested documents within a root document
 */

export interface SubdocOptions {
  /** Unique identifier for the subdocument */
  guid?: string;
  /** Auto-load content when accessed */
  autoLoad?: boolean;
  /** Custom metadata */
  meta?: Record<string, unknown>;
}

/**
 * Create a new subdocument
 * @param options - Subdocument configuration
 */
export const createSubdoc = (options?: SubdocOptions): Y.Doc => {
  return new Y.Doc({
    guid: options?.guid,
    autoLoad: options?.autoLoad,
    meta: options?.meta,
  });
};

/**
 * Get all subdocuments from a parent document
 * @param doc - The parent Yjs document
 */
export const getSubdocs = (doc: Y.Doc): Set<Y.Doc> => {
  return doc.getSubdocs();
};

/**
 * Load a subdocument (triggers sync with providers)
 * @param subdoc - The subdocument to load
 */
export const loadSubdoc = (subdoc: Y.Doc): void => {
  subdoc.load();
};

/**
 * Destroy a subdocument to free memory
 * @param subdoc - The subdocument to destroy
 */
export const destroySubdoc = (subdoc: Y.Doc): void => {
  subdoc.destroy();
};

/**
 * Listen for subdocument events on a parent document
 * @param doc - The parent Yjs document
 * @param callback - Event handler for subdoc changes
 * @returns Cleanup function
 */
export const onSubdocsChange = (
  doc: Y.Doc,
  callback: (event: {
    added: Set<Y.Doc>;
    removed: Set<Y.Doc>;
    loaded: Set<Y.Doc>;
  }) => void
): (() => void) => {
  doc.on("subdocs", callback);
  return () => doc.off("subdocs", callback);
};

/**
 * Binary Encoding Utilities
 */

/**
 * Convert Uint8Array to base64 string for JSON storage
 * @param data - Binary data
 */
export const toBase64 = (data: Uint8Array): string => {
  return btoa(String.fromCharCode(...data));
};

/**
 * Convert base64 string back to Uint8Array
 * @param base64 - Base64 encoded string
 */
export const fromBase64 = (base64: string): Uint8Array => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

/**
 * Snapshot Utilities
 * For creating and restoring document snapshots
 */

/**
 * Create a snapshot of the current document state
 * @param doc - The Yjs document
 */
export const createSnapshot = (doc: Y.Doc): Y.Snapshot => {
  return Y.snapshot(doc);
};

/**
 * Encode a snapshot for storage
 * @param snapshot - The snapshot to encode
 */
export const encodeSnapshot = (snapshot: Y.Snapshot): Uint8Array => {
  return Y.encodeSnapshot(snapshot);
};

/**
 * Decode a snapshot from binary
 * @param data - Binary encoded snapshot
 */
export const decodeSnapshot = (data: Uint8Array): Y.Snapshot => {
  return Y.decodeSnapshot(data);
};

/**
 * Check if two documents are equal at a given snapshot
 * @param doc - The document
 * @param snapshot - The snapshot to compare against
 */
export const equalSnapshots = (
  snapshot1: Y.Snapshot,
  snapshot2: Y.Snapshot
): boolean => {
  return Y.equalSnapshots(snapshot1, snapshot2);
};

/**
 * lib0 Binary Encoding Utilities
 * For custom message encoding in collaboration protocols
 */

/**
 * Create a binary encoder for building custom messages
 */
export const createEncoder = (): encoding.Encoder => {
  return encoding.createEncoder();
};

/**
 * Create a binary decoder for reading custom messages
 * @param data - Binary data to decode
 */
export const createDecoder = (data: Uint8Array): decoding.Decoder => {
  return decoding.createDecoder(data);
};

/**
 * Write a variable-length unsigned integer
 */
export const writeVarUint = (encoder: encoding.Encoder, num: number): void => {
  encoding.writeVarUint(encoder, num);
};

/**
 * Read a variable-length unsigned integer
 */
export const readVarUint = (decoder: decoding.Decoder): number => {
  return decoding.readVarUint(decoder);
};

/**
 * Write a variable-length string
 */
export const writeVarString = (encoder: encoding.Encoder, str: string): void => {
  encoding.writeVarString(encoder, str);
};

/**
 * Read a variable-length string
 */
export const readVarString = (decoder: decoding.Decoder): string => {
  return decoding.readVarString(decoder);
};

/**
 * Write a Uint8Array with length prefix
 */
export const writeVarUint8Array = (
  encoder: encoding.Encoder,
  data: Uint8Array
): void => {
  encoding.writeVarUint8Array(encoder, data);
};

/**
 * Read a Uint8Array with length prefix
 */
export const readVarUint8Array = (decoder: decoding.Decoder): Uint8Array => {
  return decoding.readVarUint8Array(decoder);
};

/**
 * Convert encoder to Uint8Array
 */
export const toUint8Array = (encoder: encoding.Encoder): Uint8Array => {
  return encoding.toUint8Array(encoder);
};

/**
 * Get current length of encoder data
 */
export const encoderLength = (encoder: encoding.Encoder): number => {
  return encoding.length(encoder);
};

/**
 * lib0 Observable Pattern
 * For creating reactive state objects
 */

/**
 * Observable class for reactive state management
 * Provides typed event emission and subscription
 */
export class Observable<Events extends { [key: string]: (...args: unknown[]) => void }>
  extends observable.Observable<Events> {}

/**
 * lib0 Map Utilities
 */

/**
 * Set a value in a map if it doesn't exist, and return the value
 * @param map - The map to modify
 * @param key - The key to set
 * @param createValue - Function to create the value if it doesn't exist
 */
export const setIfUndefined = <K, V>(
  m: Map<K, V>,
  key: K,
  createValue: () => V
): V => {
  return map.setIfUndefined(m, key, createValue);
};

/**
 * lib0 Event Loop Utilities
 */

/**
 * Debounce a function call
 * @param fn - Function to debounce
 * @param wait - Wait time in milliseconds
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): T => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }) as T;
};

/**
 * Create an interval that can be cleared
 * @param fn - Function to call
 * @param interval - Interval in milliseconds
 */
export const createInterval = (
  fn: () => void,
  interval: number
): (() => void) => {
  const id = setInterval(fn, interval);
  return () => clearInterval(id);
};

/**
 * Create a timeout that can be cleared
 * @param fn - Function to call
 * @param timeout - Timeout in milliseconds
 */
export const createTimeout = (
  fn: () => void,
  timeout: number
): (() => void) => {
  const id = setTimeout(fn, timeout);
  return () => clearTimeout(id);
};

/**
 * Wait for a specified duration
 * @param ms - Duration in milliseconds
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Custom Message Types for Collaboration Protocol
 */

export const MessageType = {
  SYNC: 0,
  AWARENESS: 1,
  AUTH: 2,
  QUERY_AWARENESS: 3,
  CUSTOM: 100,
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

/**
 * Encode a custom collaboration message
 * @param type - Message type
 * @param data - Message payload
 */
export const encodeMessage = (type: MessageType, data: Uint8Array): Uint8Array => {
  const encoder = createEncoder();
  writeVarUint(encoder, type);
  writeVarUint8Array(encoder, data);
  return toUint8Array(encoder);
};

/**
 * Decode a collaboration message
 * @param message - Encoded message
 */
export const decodeMessage = (
  message: Uint8Array
): { type: MessageType; data: Uint8Array } => {
  const decoder = createDecoder(message);
  const type = readVarUint(decoder) as MessageType;
  const data = readVarUint8Array(decoder);
  return { type, data };
};
