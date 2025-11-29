import { createStep } from "@mastra/core";
import { z } from "zod";
import {
  queryNodeInputSchema,
  queryNodeOutputSchema,
  type QueryNodeConfig,
} from "@hachi/schemas/nodes";

/**
 * Query Step
 * Entry point for RAG pipelines - handles user input
 */
export const createQueryStep = (config: Partial<QueryNodeConfig> = {}) =>
  createStep({
    id: "query",
    inputSchema: queryNodeInputSchema,
    outputSchema: queryNodeOutputSchema,
    execute: async ({ context }) => {
      const { query } = context;

      // Validate query length if maxLength is specified
      if (config.maxLength && query.length > config.maxLength) {
        throw new Error(
          `Query exceeds maximum length of ${config.maxLength} characters`
        );
      }

      return {
        query,
        timestamp: new Date().toISOString(),
      };
    },
  });

// Default export for simple usage
export const queryStep = createQueryStep();
