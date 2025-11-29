import { createStep } from "@mastra/core";
import { MDocument } from "@mastra/rag";
import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  embedNodeInputSchema,
  embedNodeOutputSchema,
  type EmbedNodeConfig,
  type EmbeddedChunk,
  type ChunkingStrategy,
} from "@hachi/schemas/nodes";

/**
 * Map chunking strategy to MDocument chunk options
 * Note: Some strategies (html, json, latex) have additional required params
 * We use recursive as fallback for complex strategies
 */
const getChunkOptions = (
  strategy: ChunkingStrategy,
  size: number,
  overlap: number,
  separator?: string
): { strategy: "recursive" | "character" | "token" | "markdown"; size: number; overlap: number; separator?: string } => {
  const baseOptions = { size, overlap };

  switch (strategy) {
    case "character":
      return { strategy: "character", ...baseOptions, separator };
    case "token":
      return { strategy: "token", ...baseOptions };
    case "markdown":
      return { strategy: "markdown", ...baseOptions };
    // HTML, JSON, and LaTeX require additional params - fallback to recursive
    case "html":
    case "json":
    case "latex":
    case "recursive":
    default:
      return { strategy: "recursive", ...baseOptions };
  }
};

/**
 * Embed Step
 * Converts text to vector embeddings using AI SDK with optional chunking via Mastra's MDocument
 */
export const createEmbedStep = (config: Partial<EmbedNodeConfig> = {}) =>
  createStep({
    id: "embed",
    inputSchema: embedNodeInputSchema,
    outputSchema: embedNodeOutputSchema,
    execute: async ({ context }) => {
      const { text } = context;
      const model = config.model || "text-embedding-3-small";
      const dimensions = config.dimensions;
      const chunking = config.chunking;

      // Create the embedding model
      const embeddingModel = openai.embedding(model, {
        dimensions,
      });

      // If chunking is enabled, use MDocument
      if (chunking) {
        const doc = MDocument.fromText(text);
        const chunkOptions = getChunkOptions(
          chunking.strategy || "recursive",
          chunking.size || 512,
          chunking.overlap || 50,
          chunking.separator
        );

        const chunks = await doc.chunk(chunkOptions);
        const chunkTexts = chunks.map((chunk) => chunk.text);

        if (chunkTexts.length === 0) {
          throw new Error("No chunks generated from text");
        }

        // Embed all chunks at once using embedMany
        const { embeddings, usage } = await embedMany({
          model: embeddingModel,
          values: chunkTexts,
        });

        // Build chunk results
        const embeddedChunks: EmbeddedChunk[] = embeddings.map((embedding, index) => ({
          text: chunkTexts[index] || "",
          embedding,
          index,
          metadata: chunks[index]?.metadata,
        }));

        // Return with first chunk as primary embedding
        const primaryEmbedding = embeddings[0];
        if (!primaryEmbedding) {
          throw new Error("No embeddings generated");
        }

        return {
          text,
          embedding: primaryEmbedding,
          model,
          dimensions: primaryEmbedding.length,
          tokenCount: usage?.tokens,
          chunks: embeddedChunks,
        };
      }

      // No chunking - embed the full text directly
      const { embedding, usage } = await embed({
        model: embeddingModel,
        value: text,
      });

      return {
        text,
        embedding,
        model,
        dimensions: embedding.length,
        tokenCount: usage?.tokens,
      };
    },
  });

// Default export for simple usage
export const embedStep = createEmbedStep();
