import { createStep } from "@mastra/core";
import { z } from "zod";
import {
  hydeNodeInputSchema,
  hydeNodeOutputSchema,
  type HyDENodeConfig,
} from "@hachi/schemas/nodes";

/**
 * HyDE (Hypothetical Document Embeddings) Step
 * Generates hypothetical documents to improve retrieval for short queries
 */
export const createHyDEStep = (config: Partial<HyDENodeConfig> = {}) =>
  createStep({
    id: "hyde",
    inputSchema: hydeNodeInputSchema,
    outputSchema: hydeNodeOutputSchema,
    execute: async ({ context }) => {
      const { query } = context;
      const model = config.model || "gpt-4o-mini";
      const temperature = config.temperature ?? 0.7;
      const numHypothetical = config.numHypothetical || 1;
      const systemPrompt = config.systemPrompt || "Given a query, write a hypothetical document that would perfectly answer this query. Be detailed and specific.";

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is required for HyDE");
      }

      // Generate hypothetical documents
      const hypotheticalDocuments: string[] = [];

      for (let i = 0; i < numHypothetical; i++) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: query },
            ],
            temperature,
          }),
        });

        if (!response.ok) {
          const error = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
          throw new Error(
            `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
          );
        }

        interface OpenAIResponse {
          choices: Array<{ message: { content: string } }>;
        }

        const data = (await response.json()) as OpenAIResponse;
        const choice = data.choices[0];
        if (!choice) {
          throw new Error("No response from OpenAI");
        }
        hypotheticalDocuments.push(choice.message.content);
      }

      return {
        query,
        hypotheticalDocuments,
        model,
      };
    },
  });

// Default export for simple usage
export const hydeStep = createHyDEStep();
