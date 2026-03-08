import { createStep } from "@mastra/core/workflows";
import {
  evalRelevancyInputSchema,
  evalRelevancyOutputSchema,
  type EvalRelevancyConfig,
} from "@hachi/schemas/nodes";

/**
 * Relevancy Evaluator Step
 * Evaluates whether the generated answer is relevant to the original query.
 * Returns a relevancy score (0-1) with reasoning.
 */
export const createEvalRelevancyStep = (
  config: Partial<EvalRelevancyConfig> = {}
) =>
  createStep({
    id: "eval-relevancy",
    inputSchema: evalRelevancyInputSchema,
    outputSchema: evalRelevancyOutputSchema,
    execute: async ({ inputData }) => {
      const { query, answer } = inputData;
      const model = config.model || "gpt-4o-mini";
      const temperature = config.temperature ?? 0;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is required for Relevancy evaluation");
      }

      const systemPrompt = `You are a relevancy evaluator for a RAG system.

Your task is to evaluate whether the given answer is relevant to the user's query.

Consider:
1. Does the answer address the question asked?
2. Is the answer on-topic and useful?
3. Does it provide the type of information the user was looking for?

Respond in JSON format:
{
  "score": 0.85,
  "reasoning": "Detailed explanation of the relevancy assessment..."
}

Score guide:
- 1.0: Perfectly relevant, directly answers the query
- 0.7-0.9: Mostly relevant with minor off-topic elements
- 0.4-0.6: Partially relevant, addresses some aspects
- 0.1-0.3: Mostly irrelevant, tangentially related
- 0.0: Completely irrelevant`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Query: "${query}"\n\nAnswer: "${answer}"`,
              },
            ],
            temperature,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
        );
      }

      interface OpenAIResponse {
        choices: Array<{ message: { content: string } }>;
      }

      interface RelevancyResult {
        score: number;
        reasoning: string;
      }

      const data = (await response.json()) as OpenAIResponse;
      const choice = data.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI");
      }

      const result = JSON.parse(choice.message.content) as RelevancyResult;

      return {
        score: Math.max(0, Math.min(1, result.score)),
        reasoning: result.reasoning,
      };
    },
  });

export const evalRelevancyStep = createEvalRelevancyStep();
