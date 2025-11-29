import { createStep } from "@mastra/core";
import { PgVector } from "@mastra/pg";
import { PineconeVector } from "@mastra/pinecone";
import { QdrantVector } from "@mastra/qdrant";
import { ChromaVector } from "@mastra/chroma";
import { UpstashVector } from "@mastra/upstash";
import { MongoDBVector } from "@mastra/mongodb";
import {
  retrieveNodeInputSchema,
  retrieveNodeOutputSchema,
  type RetrieveNodeConfig,
  type VectorStoreType,
  type Document,
} from "@hachi/schemas/nodes";

/**
 * In-memory vector store for development/testing
 */
class InMemoryVectorStore {
  private documents: Map<string, { embedding: number[]; metadata: Record<string, unknown> }> = new Map();

  async query(params: {
    indexName: string;
    queryVector: number[];
    topK: number;
    filter?: Record<string, unknown>;
    includeVector?: boolean;
  }): Promise<Array<{ id: string; score: number; metadata?: Record<string, unknown>; vector?: number[] }>> {
    const results: Array<{ id: string; score: number; metadata?: Record<string, unknown>; vector?: number[] }> = [];

    for (const [id, doc] of this.documents) {
      const score = cosineSimilarity(params.queryVector, doc.embedding);
      results.push({
        id,
        score,
        metadata: doc.metadata,
        ...(params.includeVector ? { vector: doc.embedding } : {}),
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, params.topK);
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const aVal = a[i] ?? 0;
    const bVal = b[i] ?? 0;
    dotProduct += aVal * bVal;
    normA += aVal * aVal;
    normB += bVal * bVal;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

// Singleton instances for vector stores (created lazily)
let vectorStoreInstances: Map<string, unknown> = new Map();

/**
 * Get or create a vector store instance based on configuration
 */
const getVectorStore = (type: VectorStoreType): unknown => {
  const cacheKey = type;

  if (vectorStoreInstances.has(cacheKey)) {
    return vectorStoreInstances.get(cacheKey);
  }

  let store: unknown;

  switch (type) {
    case "pgvector": {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL is required for pgvector");
      }
      store = new PgVector({ connectionString });
      break;
    }

    case "pinecone": {
      const apiKey = process.env.PINECONE_API_KEY;
      if (!apiKey) {
        throw new Error("PINECONE_API_KEY is required for Pinecone");
      }
      store = new PineconeVector({ apiKey });
      break;
    }

    case "qdrant": {
      const url = process.env.QDRANT_URL;
      const apiKey = process.env.QDRANT_API_KEY;
      if (!url) {
        throw new Error("QDRANT_URL is required for Qdrant");
      }
      store = new QdrantVector({ url, apiKey });
      break;
    }

    case "chroma": {
      const apiKey = process.env.CHROMA_API_KEY;
      const tenant = process.env.CHROMA_TENANT;
      const database = process.env.CHROMA_DATABASE;
      // Chroma can run locally without config
      store = apiKey
        ? new ChromaVector({ apiKey, tenant, database })
        : new ChromaVector();
      break;
    }

    case "upstash": {
      const url = process.env.UPSTASH_URL;
      const token = process.env.UPSTASH_TOKEN;
      if (!url || !token) {
        throw new Error("UPSTASH_URL and UPSTASH_TOKEN are required for Upstash");
      }
      store = new UpstashVector({ url, token });
      break;
    }

    case "mongodb": {
      const uri = process.env.MONGODB_URI;
      const dbName = process.env.MONGODB_DATABASE || "hachi";
      if (!uri) {
        throw new Error("MONGODB_URI is required for MongoDB");
      }
      store = new MongoDBVector({ uri, dbName });
      break;
    }

    case "memory":
    default:
      store = new InMemoryVectorStore();
      break;
  }

  vectorStoreInstances.set(cacheKey, store);
  return store;
};

/**
 * Common interface for vector store query results
 */
interface QueryResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
  vector?: number[];
}

/**
 * Retrieve Step
 * Performs vector similarity search using Mastra's unified vector store interface
 */
export const createRetrieveStep = (config: Partial<RetrieveNodeConfig> = {}) =>
  createStep({
    id: "retrieve",
    inputSchema: retrieveNodeInputSchema,
    outputSchema: retrieveNodeOutputSchema,
    execute: async ({ context }) => {
      const { embedding, query } = context;
      const vectorStoreType = config.vectorStore || (process.env.VECTOR_STORE_TYPE as VectorStoreType) || "memory";
      const indexName = config.indexName || process.env.VECTOR_INDEX_NAME || "documents";
      const topK = config.topK || 5;
      const scoreThreshold = config.scoreThreshold;
      const filter = config.filter;
      const includeVector = config.includeVector ?? false;

      // Get the appropriate vector store
      const store = getVectorStore(vectorStoreType) as {
        query: (params: {
          indexName: string;
          queryVector: number[];
          topK: number;
          filter?: Record<string, unknown>;
          includeVector?: boolean;
        }) => Promise<QueryResult[]>;
      };

      // Execute the query
      const results = await store.query({
        indexName,
        queryVector: embedding,
        topK,
        filter,
        includeVector,
      });

      // Transform results to documents
      let documents: Document[] = results.map((result) => ({
        id: result.id,
        content: (result.metadata?.text as string) || (result.metadata?.content as string) || "",
        metadata: result.metadata,
        score: result.score,
      }));

      // Apply score threshold filtering
      if (scoreThreshold !== undefined) {
        documents = documents.filter((doc) => doc.score >= scoreThreshold);
      }

      return {
        documents,
        query,
        totalFound: documents.length,
      };
    },
  });

// Default export for simple usage
export const retrieveStep = createRetrieveStep();
