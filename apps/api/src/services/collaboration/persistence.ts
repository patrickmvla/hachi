import * as Y from "yjs";
import { db } from "@hachi/database/client";
import { canvases } from "@hachi/database/schema";
import { eq } from "drizzle-orm";
import type { PersistenceCallback } from "./server";

/**
 * Database persistence for Yjs documents
 * Stores document state in the canvases table
 */
export const createDatabasePersistence = (): PersistenceCallback => {
  return {
    /**
     * Load document state from database
     */
    async bindState(docName: string, doc: Y.Doc): Promise<void> {
      // Extract canvas ID from room name (format: "canvas-{id}")
      const match = docName.match(/^canvas-(.+)$/);
      if (!match) {
        console.log(`[Persistence] Skipping non-canvas document: ${docName}`);
        return;
      }

      const canvasId = match[1]!;

      try {
        const canvas = await db.query.canvases.findFirst({
          where: eq(canvases.id, canvasId),
        });

        if (canvas?.yjsState) {
          // Apply stored state to document
          const state =
            typeof canvas.yjsState === "string"
              ? Uint8Array.from(atob(canvas.yjsState), (c) => c.charCodeAt(0))
              : new Uint8Array(canvas.yjsState as ArrayBuffer);

          Y.applyUpdate(doc, state);
          console.log(`[Persistence] Loaded state for canvas: ${canvasId}`);
        } else {
          console.log(`[Persistence] No existing state for canvas: ${canvasId}`);
        }
      } catch (error) {
        console.error(`[Persistence] Failed to load state for ${docName}:`, error);
      }
    },

    /**
     * Save document state to database
     */
    async writeState(docName: string, doc: Y.Doc): Promise<void> {
      // Extract canvas ID from room name
      const match = docName.match(/^canvas-(.+)$/);
      if (!match) {
        return;
      }

      const canvasId = match[1]!;

      try {
        // Encode document state
        const state = Y.encodeStateAsUpdate(doc);
        const base64State = btoa(String.fromCharCode(...state));

        // Update canvas with Yjs state
        await db
          .update(canvases)
          .set({
            yjsState: base64State,
            updatedAt: new Date(),
          })
          .where(eq(canvases.id, canvasId));

        console.log(`[Persistence] Saved state for canvas: ${canvasId}`);
      } catch (error) {
        console.error(`[Persistence] Failed to save state for ${docName}:`, error);
      }
    },
  };
};

/**
 * In-memory persistence for development/testing
 */
export const createMemoryPersistence = (): PersistenceCallback => {
  const states = new Map<string, Uint8Array>();

  return {
    async bindState(docName: string, doc: Y.Doc): Promise<void> {
      const state = states.get(docName);
      if (state) {
        Y.applyUpdate(doc, state);
        console.log(`[Memory Persistence] Loaded state for: ${docName}`);
      }
    },

    async writeState(docName: string, doc: Y.Doc): Promise<void> {
      const state = Y.encodeStateAsUpdate(doc);
      states.set(docName, state);
      console.log(`[Memory Persistence] Saved state for: ${docName}`);
    },
  };
};
