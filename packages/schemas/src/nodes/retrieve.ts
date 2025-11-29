import { z } from "zod";

/**
 * Supported vector store types based on Mastra's vector database support
 */
export const vectorStoreTypeSchema = z.enum([
  "pgvector",    // PostgreSQL with pgvector
  "pinecone",    // Pinecone
  "qdrant",      // Qdrant
  "chroma",      // ChromaDB
  "libsql",      // LibSQL/Turso
  "upstash",     // Upstash Vector
  "mongodb",     // MongoDB Atlas Vector Search
  "memory",      // In-memory (for development)
]);

/**
 * Retrieve Node Schema
 * Performs vector similarity search to retrieve relevant documents
 */
export const retrieveNodeConfigSchema = z.object({
  vectorStore: vectorStoreTypeSchema.default("pgvector"),
  indexName: z.string().default("documents"),
  topK: z.number().min(1).max(100).default(5),
  scoreThreshold: z.number().min(0).max(1).optional(),
  filter: z.record(z.unknown()).optional(), // Metadata filters
  namespace: z.string().optional(), // Vector store namespace (Pinecone)
  includeMetadata: z.boolean().default(true),
  includeVector: z.boolean().default(false),
});

export const retrieveNodeInputSchema = z.object({
  embedding: z.array(z.number()),
  query: z.string().optional(), // Original query for context
});

export const documentSchema = z.object({
  id: z.string(),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
  score: z.number(),
});

export const retrieveNodeOutputSchema = z.object({
  documents: z.array(documentSchema),
  query: z.string().optional(),
  totalFound: z.number(),
});

export type VectorStoreType = z.infer<typeof vectorStoreTypeSchema>;
export type RetrieveNodeConfig = z.infer<typeof retrieveNodeConfigSchema>;
export type RetrieveNodeInput = z.infer<typeof retrieveNodeInputSchema>;
export type RetrieveNodeOutput = z.infer<typeof retrieveNodeOutputSchema>;
export type Document = z.infer<typeof documentSchema>;
