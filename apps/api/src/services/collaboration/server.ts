import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

/**
 * Message types for Yjs WebSocket protocol
 */
const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

/**
 * Document store - maps room names to Yjs documents
 */
const docs = new Map<string, WSSharedDoc>();

/**
 * Persistence callback type
 */
export type PersistenceCallback = {
  bindState: (docName: string, doc: Y.Doc) => Promise<void>;
  writeState: (docName: string, doc: Y.Doc) => Promise<void>;
};

let persistence: PersistenceCallback | null = null;

/**
 * Set persistence layer for document storage
 */
export const setPersistence = (p: PersistenceCallback) => {
  persistence = p;
};

/**
 * Extended Yjs Document with awareness and connections
 */
class WSSharedDoc extends Y.Doc {
  name: string;
  awareness: awarenessProtocol.Awareness;
  conns: Map<WebSocket, Set<number>>;

  constructor(name: string) {
    super({ gc: true });
    this.name = name;
    this.conns = new Map();
    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    // Handle awareness updates
    this.awareness.on(
      "update",
      ({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }) => {
        const changedClients = added.concat(updated, removed);
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
          encoder,
          awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
        );
        const message = encoding.toUint8Array(encoder);
        this.conns.forEach((_, conn) => {
          send(conn, message);
        });
      }
    );

    // Handle document updates
    this.on("update", (update: Uint8Array, origin: unknown) => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeUpdate(encoder, update);
      const message = encoding.toUint8Array(encoder);
      this.conns.forEach((_, conn) => {
        if (origin !== conn) {
          send(conn, message);
        }
      });
    });
  }
}

/**
 * Get or create a shared document
 */
const getYDoc = async (docName: string): Promise<WSSharedDoc> => {
  let doc = docs.get(docName);
  if (!doc) {
    doc = new WSSharedDoc(docName);
    docs.set(docName, doc);

    // Load persisted state if available
    if (persistence) {
      await persistence.bindState(docName, doc);
    }
  }
  return doc;
};

/**
 * Send message to WebSocket
 */
const send = (conn: WebSocket, message: Uint8Array) => {
  if (conn.readyState === WebSocket.OPEN) {
    conn.send(message);
  }
};

/**
 * Handle incoming WebSocket message
 */
const messageHandler = (conn: WebSocket, doc: WSSharedDoc, message: Uint8Array) => {
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);

  switch (messageType) {
    case MESSAGE_SYNC:
      {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, doc, conn);

        // If it's a sync step 1 message, we need to respond
        if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
          // Response is already written to encoder
        }

        if (encoding.length(encoder) > 1) {
          send(conn, encoding.toUint8Array(encoder));
        }
      }
      break;

    case MESSAGE_AWARENESS:
      {
        awarenessProtocol.applyAwarenessUpdate(
          doc.awareness,
          decoding.readVarUint8Array(decoder),
          conn
        );
      }
      break;
  }
};

/**
 * Setup connection for a WebSocket client
 */
const setupConnection = async (conn: WebSocket, docName: string) => {
  const doc = await getYDoc(docName);

  doc.conns.set(conn, new Set());

  // Send sync step 1 (document state)
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  syncProtocol.writeSyncStep1(encoder, doc);
  send(conn, encoding.toUint8Array(encoder));

  // Send awareness states
  const awarenessStates = doc.awareness.getStates();
  if (awarenessStates.size > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
      awarenessEncoder,
      awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys()))
    );
    send(conn, encoding.toUint8Array(awarenessEncoder));
  }

  return doc;
};

/**
 * Close connection and cleanup
 */
const closeConnection = (doc: WSSharedDoc, conn: WebSocket) => {
  const controlledIds = doc.conns.get(conn);
  doc.conns.delete(conn);

  // Remove awareness states for this connection
  if (controlledIds) {
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
  }

  // If no more connections, persist and potentially cleanup
  if (doc.conns.size === 0) {
    if (persistence) {
      persistence.writeState(doc.name, doc).catch(console.error);
    }
    // Optionally remove from memory after some time
    // docs.delete(doc.name);
  }
};

/**
 * WebSocket connection data stored per socket
 */
interface WSData {
  docName: string;
  doc: WSSharedDoc | null;
}

/**
 * Create the collaboration WebSocket server using Bun
 */
export const createCollaborationServer = (port: number) => {
  return Bun.serve<WSData>({
    port,
    fetch(req, server) {
      const url = new URL(req.url);

      // Health check endpoint
      if (url.pathname === "/health") {
        return new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Extract room name from path: /rooms/:roomName
      const match = url.pathname.match(/^\/rooms\/(.+)$/);
      if (!match) {
        return new Response("Room name required", { status: 400 });
      }

      const docName = decodeURIComponent(match[1]!);

      // Optional: Extract auth token from query params
      const authToken = url.searchParams.get("auth");

      // Upgrade to WebSocket
      const upgraded = server.upgrade(req, {
        data: { docName, doc: null } as WSData,
      });

      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 500 });
      }

      return undefined;
    },

    websocket: {
      async open(ws) {
        const { docName } = ws.data;
        console.log(`[Collab] Client connected to room: ${docName}`);

        try {
          const doc = await setupConnection(ws as unknown as WebSocket, docName);
          ws.data.doc = doc;
        } catch (error) {
          console.error(`[Collab] Failed to setup connection:`, error);
          ws.close();
        }
      },

      message(ws, message) {
        const { doc } = ws.data;
        if (!doc) return;

        try {
          const data =
            message instanceof ArrayBuffer
              ? new Uint8Array(message)
              : typeof message === "string"
                ? new TextEncoder().encode(message)
                : new Uint8Array(message);

          messageHandler(ws as unknown as WebSocket, doc, data);
        } catch (error) {
          console.error(`[Collab] Message handling error:`, error);
        }
      },

      close(ws) {
        const { doc, docName } = ws.data;
        console.log(`[Collab] Client disconnected from room: ${docName}`);

        if (doc) {
          closeConnection(doc, ws as unknown as WebSocket);
        }
      },
    },
  });
};

/**
 * Get stats about active documents and connections
 */
export const getCollaborationStats = () => {
  const stats = {
    totalDocs: docs.size,
    totalConnections: 0,
    rooms: [] as { name: string; connections: number }[],
  };

  docs.forEach((doc, name) => {
    const connections = doc.conns.size;
    stats.totalConnections += connections;
    stats.rooms.push({ name, connections });
  });

  return stats;
};
