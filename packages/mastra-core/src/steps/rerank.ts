import { createStep } from "@mastra/core";
import {
  rerankWithScorer,
  CohereRelevanceScorer,
} from "@mastra/rag";
import {
  rerankNodeInputSchema,
  rerankNodeOutputSchema,
  type RerankNodeConfig,
  type RerankProvider,
} from "@hachi/schemas/nodes";

/**
 * Get or create a relevance scorer based on provider configuration
 */
const getRelevanceScorer = (provider: RerankProvider, model: string) => {
  switch (provider) {
    case "cohere": {
      const apiKey = process.env.COHERE_API_KEY;
      if (!apiKey) {
        throw new Error("COHERE_API_KEY is required for Cohere reranking");
      }
      return new CohereRelevanceScorer(model, apiKey);
    }

    case "mastra": {
      // MastraAgentRelevanceScorer requires an LLM model
      // For now, fall back to Cohere as default
      const apiKey = process.env.COHERE_API_KEY;
      if (!apiKey) {
        throw new Error("COHERE_API_KEY is required (mastra provider not yet implemented)");
      }
      return new CohereRelevanceScorer("rerank-v3.5", apiKey);
    }

    case "zero-entropy": {
      // ZeroEntropyRelevanceScorer
      // For now, fall back to Cohere as default
      const apiKey = process.env.COHERE_API_KEY;
      if (!apiKey) {
        throw new Error("COHERE_API_KEY is required (zero-entropy provider not yet implemented)");
      }
      return new CohereRelevanceScorer("rerank-v3.5", apiKey);
    }

    default:
      throw new Error(`Unsupported reranking provider: ${provider}`);
  }
};

/**
 * Rerank Step
 * Re-orders retrieved documents using Mastra's reranking providers
 */
export const createRerankStep = (config: Partial<RerankNodeConfig> = {}) =>
  createStep({
    id: "rerank",
    inputSchema: rerankNodeInputSchema,
    outputSchema: rerankNodeOutputSchema,
    execute: async ({ context }) => {
      const { query, documents } = context;
      const provider = config.provider || "cohere";
      const model = config.model || "rerank-v3.5";
      const topN = config.topN || 3;
      const weights = config.weights;

      if (documents.length === 0) {
        return {
          query,
          documents: [],
          model,
          provider,
        };
      }

      // Get the relevance scorer
      const scorer = getRelevanceScorer(provider, model);

      // Convert documents to the QueryResult format expected by Mastra's rerank
      const results = documents.map((doc) => ({
        id: doc.id,
        score: doc.score || 0,
        metadata: {
          ...doc.metadata,
          text: doc.content,
        },
      }));

      // Rerank the results using rerankWithScorer
      const rerankedResults = await rerankWithScorer({
        results,
        query,
        scorer,
        options: {
          topK: topN,
          weights,
        },
      });

      // Transform reranked results back to our document format
      const rerankedDocuments = rerankedResults.map((rerankResult, idx) => {
        const resultId = rerankResult.result.id;
        // Find the original document to get the content
        const originalDoc = documents.find((d) => d.id === resultId);
        return {
          id: resultId,
          content: originalDoc?.content || (rerankResult.result.metadata?.text as string) || "",
          metadata: rerankResult.result.metadata,
          originalScore: originalDoc?.score,
          rerankScore: rerankResult.score,
          rank: idx + 1,
        };
      });

      return {
        query,
        documents: rerankedDocuments,
        model,
        provider,
      };
    },
  });

// Default export for simple usage
export const rerankStep = createRerankStep();
