import { createStep } from "@mastra/core";
import { z } from "zod";
import {
  generateNodeInputSchema,
  generateNodeOutputSchema,
  type GenerateNodeConfig,
} from "@hachi/schemas/nodes";

/**
 * Generate Step
 * Uses an LLM to generate text responses
 */
export const createGenerateStep = (config: Partial<GenerateNodeConfig> = {}) =>
  createStep({
    id: "generate",
    inputSchema: generateNodeInputSchema,
    outputSchema: generateNodeOutputSchema,
    execute: async ({ context: ctx }) => {
      const { query, context, documents } = ctx;
      const model = config.model || "gpt-4o-mini";
      const systemPrompt = config.systemPrompt;
      const temperature = config.temperature ?? 0.7;
      const maxTokens = config.maxTokens;
      const topP = config.topP;
      const frequencyPenalty = config.frequencyPenalty;
      const presencePenalty = config.presencePenalty;
      const responseFormat = config.responseFormat || "text";

      // Determine provider from model name
      const isAnthropic = model.startsWith("claude");

      if (isAnthropic) {
        return generateWithAnthropic({
          query,
          context,
          documents,
          model,
          systemPrompt,
          temperature,
          maxTokens,
        });
      } else {
        return generateWithOpenAI({
          query,
          context,
          documents,
          model,
          systemPrompt,
          temperature,
          maxTokens,
          topP,
          frequencyPenalty,
          presencePenalty,
          responseFormat,
        });
      }
    },
  });

/**
 * Generate with OpenAI
 */
const generateWithOpenAI = async ({
  query,
  context,
  documents,
  model,
  systemPrompt,
  temperature,
  maxTokens,
  topP,
  frequencyPenalty,
  presencePenalty,
  responseFormat,
}: {
  query: string;
  context?: string;
  documents?: Array<{ content: string; metadata?: Record<string, unknown> }>;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  responseFormat?: "text" | "json";
}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is required for generation");
  }

  // Build context from documents if provided
  let fullContext = context || "";
  if (documents && documents.length > 0) {
    const docContext = documents
      .map((doc, i) => `[Document ${i + 1}]:\n${doc.content}`)
      .join("\n\n");
    fullContext = fullContext ? `${fullContext}\n\n${docContext}` : docContext;
  }

  // Build messages
  const messages: Array<{ role: string; content: string }> = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  } else if (fullContext) {
    messages.push({
      role: "system",
      content: `You are a helpful assistant. Answer the user's question based on the following context:\n\n${fullContext}\n\nIf the context doesn't contain relevant information, say so clearly.`,
    });
  }

  messages.push({ role: "user", content: query });

  // Build request body
  const requestBody: Record<string, unknown> = {
    model,
    messages,
  };

  if (temperature !== undefined) requestBody.temperature = temperature;
  if (maxTokens !== undefined) requestBody.max_tokens = maxTokens;
  if (topP !== undefined) requestBody.top_p = topP;
  if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty;
  if (presencePenalty !== undefined) requestBody.presence_penalty = presencePenalty;
  if (responseFormat === "json") {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(
      `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
    );
  }

  interface OpenAIResponse {
    model: string;
    choices: Array<{ message: { content: string }; finish_reason: string }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }

  const data = (await response.json()) as OpenAIResponse;
  const choice = data.choices[0];
  if (!choice) {
    throw new Error("No response from OpenAI");
  }

  return {
    response: choice.message.content,
    model: data.model,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined,
    finishReason: choice.finish_reason,
  };
};

/**
 * Generate with Anthropic
 */
const generateWithAnthropic = async ({
  query,
  context,
  documents,
  model,
  systemPrompt,
  temperature,
  maxTokens,
}: {
  query: string;
  context?: string;
  documents?: Array<{ content: string; metadata?: Record<string, unknown> }>;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API key is required for generation");
  }

  // Build context from documents if provided
  let fullContext = context || "";
  if (documents && documents.length > 0) {
    const docContext = documents
      .map((doc, i) => `[Document ${i + 1}]:\n${doc.content}`)
      .join("\n\n");
    fullContext = fullContext ? `${fullContext}\n\n${docContext}` : docContext;
  }

  // Build system prompt
  let system = systemPrompt || "";
  if (fullContext && !systemPrompt) {
    system = `You are a helpful assistant. Answer the user's question based on the following context:\n\n${fullContext}\n\nIf the context doesn't contain relevant information, say so clearly.`;
  } else if (fullContext && systemPrompt) {
    system = `${systemPrompt}\n\nContext:\n${fullContext}`;
  }

  // Build request body
  const requestBody: Record<string, unknown> = {
    model,
    messages: [{ role: "user", content: query }],
    max_tokens: maxTokens || 4096,
  };

  if (system) requestBody.system = system;
  if (temperature !== undefined) requestBody.temperature = temperature;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(
      `Anthropic API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`
    );
  }

  interface AnthropicResponse {
    model: string;
    content: Array<{ text: string }>;
    usage: { input_tokens: number; output_tokens: number };
    stop_reason: string;
  }

  const data = (await response.json()) as AnthropicResponse;
  const content = data.content[0];
  if (!content) {
    throw new Error("No response from Anthropic");
  }

  return {
    response: content.text,
    model: data.model,
    usage: {
      promptTokens: data.usage.input_tokens,
      completionTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens,
    },
    finishReason: data.stop_reason,
  };
};

// Default export for simple usage
export const generateStep = createGenerateStep();
