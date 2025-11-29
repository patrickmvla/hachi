// Types
export type {
  UserPresence,
  CursorPosition,
  UserAwareness,
  CanvasYjsState,
  CollaborationConfig,
  CollaborationEvent,
  CollaborationEventListener,
  UndoManagerConfig,
  UndoManagerStackEvent,
  // Y.Event types
  YEventBase,
  YKeyChangeAction,
  YKeyChange,
  YArrayDelta,
  YMapEvent,
  YArrayEvent,
  YTextEvent,
  YXmlEvent,
} from "./types";

// Provider
export { CollaborationProvider } from "./provider";

// Presence utilities
export {
  generateUserColor,
  createUserPresence,
  filterActiveUsers,
  getUsersWithCursors,
  sortByActivity,
} from "./presence";

// React hooks
export {
  useCollaboration,
  useCursor,
  useRemoteCursors,
  usePresence,
  useYjsMap,
  useYjsArray,
  useYjsText,
  useUndoManager,
  createCollaborationConfig,
} from "./hooks";

// Hook operation types
export type {
  YMapOperations,
  YArrayOperations,
  YTextOperations,
  UndoManagerState,
  UndoManagerOperations,
  // Hook options with onChange callbacks
  UseYjsMapOptions,
  UseYjsArrayOptions,
  UseYjsTextOptions,
} from "./hooks";

// Zustand stores (for non-React usage or advanced patterns)
export {
  createCollaborationStore,
  createYMapStore,
  createYArrayStore,
  createYTextStore,
  createUndoManagerStore,
  getYMapStore,
  getYArrayStore,
  getYTextStore,
  getUndoManagerStore,
  clearAllStores,
} from "./store";

// Store types
export type {
  CollaborationState,
  CollaborationStore,
  YMapState,
  YMapStore,
  YArrayState,
  YArrayStore,
  YTextState,
  YTextStore,
  UndoManagerStoreState,
  UndoManagerStore,
  TextDelta,
} from "./store";

// Document update utilities
export {
  encodeDocumentState,
  applyDocumentUpdate,
  getStateVector,
  mergeUpdates,
  diffUpdate,
  getStateVectorFromUpdate,
} from "./utils";

// Relative position utilities
export {
  createRelativePosition,
  toAbsolutePosition,
  encodeRelativePosition,
  decodeRelativePosition,
  relativePositionToJSON,
  relativePositionFromJSON,
} from "./utils";

// Subdocument utilities
export {
  createSubdoc,
  getSubdocs,
  loadSubdoc,
  destroySubdoc,
  onSubdocsChange,
} from "./utils";

// Binary encoding utilities
export { toBase64, fromBase64 } from "./utils";

// Snapshot utilities
export {
  createSnapshot,
  encodeSnapshot,
  decodeSnapshot,
  equalSnapshots,
} from "./utils";

// lib0 encoding utilities
export {
  createEncoder,
  createDecoder,
  writeVarUint,
  readVarUint,
  writeVarString,
  readVarString,
  writeVarUint8Array,
  readVarUint8Array,
  toUint8Array,
  encoderLength,
} from "./utils";

// lib0 observable
export { Observable } from "./utils";

// lib0 map utilities
export { setIfUndefined } from "./utils";

// Event loop utilities
export { debounce, createInterval, createTimeout, wait } from "./utils";

// Message protocol
export { MessageType, encodeMessage, decodeMessage } from "./utils";

// Utility types
export type { RelativePosition, AbsolutePosition, SubdocOptions } from "./utils";
