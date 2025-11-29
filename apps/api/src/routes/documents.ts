import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@hachi/database/client";
import { documents } from "@hachi/database/schema";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireWorkspace } from "../middleware/workspace";
import { eq, sql } from "drizzle-orm";
import {
  processDocument,
  embedChunks,
  searchDocuments,
  countDocuments,
  countEmbeddedDocuments,
} from "../services/documents";

const uploadDocumentSchema = z.object({
  filename: z.string().min(1),
  content: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

const searchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(10),
  minScore: z.number().optional().default(0.5),
});

const processDocumentSchema = z.object({
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
});

export const documentRoutes = new Hono<AppEnv>()
  // List documents for workspace
  .get("/", requireAuth, requireWorkspace, async (c) => {
    const workspace = c.get("workspace");

    const workspaceDocuments = await db
      .select({
        id: documents.id,
        workspaceId: documents.workspaceId,
        content: documents.content,
        metadata: documents.metadata,
        hasEmbedding: sql<boolean>`${documents.embedding} IS NOT NULL`,
        createdAt: documents.createdAt,
      })
      .from(documents)
      .where(eq(documents.workspaceId, workspace.id))
      .orderBy(documents.createdAt);

    // Get counts
    const totalCount = await countDocuments(workspace.id);
    const embeddedCount = await countEmbeddedDocuments(workspace.id);

    return c.json({
      documents: workspaceDocuments,
      stats: {
        total: totalCount,
        embedded: embeddedCount,
        pending: totalCount - embeddedCount,
      },
    });
  })

  // Get document by ID
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    const document = result[0];
    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    return c.json({ document });
  })

  // Upload document
  .post(
    "/",
    requireAuth,
    requireWorkspace,
    zValidator("json", uploadDocumentSchema),
    async (c) => {
      const workspace = c.get("workspace");
      const { filename, content, metadata } = c.req.valid("json");

      const result = await db
        .insert(documents)
        .values({
          workspaceId: workspace.id,
          content,
          metadata: {
            ...metadata,
            filename,
            uploadedAt: new Date().toISOString(),
          },
        })
        .returning();

      const document = result[0];
      if (!document) {
        return c.json({ error: "Failed to create document" }, 500);
      }

      return c.json({ document }, 201);
    }
  )

  // Process document (chunk + embed)
  .post(
    "/:id/process",
    requireAuth,
    zValidator("json", processDocumentSchema),
    async (c) => {
      const id = c.req.param("id");
      const options = c.req.valid("json");

      // Get document
      const result = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id))
        .limit(1);

      const document = result[0];
      if (!document) {
        return c.json({ error: "Document not found" }, 404);
      }

      // Get OpenAI API key from environment or workspace credentials
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return c.json({ error: "OpenAI API key not configured" }, 500);
      }

      try {
        // Get filename from metadata
        const metadata = document.metadata as Record<string, unknown> | null;
        const filename = (metadata?.filename as string) || "document.txt";

        // Process document (chunk)
        const { chunks, documentType, totalChunks, totalCharacters } =
          await processDocument(id, filename, document.content, {
            chunkSize: options.chunkSize,
            chunkOverlap: options.chunkOverlap,
          });

        // Embed chunks
        const embeddedChunks = await embedChunks(chunks, { apiKey });

        // For now, we'll use the average of all chunk embeddings
        // In a more sophisticated system, we'd store each chunk separately
        if (embeddedChunks.length > 0) {
          const avgEmbedding = new Array(embeddedChunks[0]!.dimensions).fill(0);
          for (const chunk of embeddedChunks) {
            for (let i = 0; i < chunk.embedding.length; i++) {
              avgEmbedding[i] += chunk.embedding[i]! / embeddedChunks.length;
            }
          }

          // Update document with embedding
          await db
            .update(documents)
            .set({
              embedding: avgEmbedding,
              metadata: {
                ...metadata,
                documentType,
                totalChunks,
                totalCharacters,
                processedAt: new Date().toISOString(),
              },
            })
            .where(eq(documents.id, id));
        }

        return c.json({
          success: true,
          documentType,
          totalChunks,
          totalCharacters,
          embeddingDimensions: embeddedChunks[0]?.dimensions || 1536,
        });
      } catch (error) {
        console.error("Error processing document:", error);
        return c.json(
          {
            error: "Failed to process document",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )

  // Delete document
  .delete("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");

    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    const existing = result[0];
    if (!existing) {
      return c.json({ error: "Document not found" }, 404);
    }

    await db.delete(documents).where(eq(documents.id, id));

    return c.json({ deleted: true, id });
  })

  // Vector search
  .post(
    "/search",
    requireAuth,
    requireWorkspace,
    zValidator("json", searchSchema),
    async (c) => {
      const workspace = c.get("workspace");
      const { query, limit, minScore } = c.req.valid("json");

      // Get OpenAI API key
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return c.json({ error: "OpenAI API key not configured" }, 500);
      }

      try {
        const results = await searchDocuments(
          query,
          { apiKey },
          {
            workspaceId: workspace.id,
            topK: limit,
            minScore,
          }
        );

        return c.json({ results });
      } catch (error) {
        console.error("Error searching documents:", error);
        return c.json(
          {
            error: "Search failed",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  );
