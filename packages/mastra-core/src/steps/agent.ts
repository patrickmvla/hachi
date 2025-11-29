import { createStep } from "@mastra/core";
import {
  agentNodeInputSchema,
  agentNodeOutputSchema,
  type AgentNodeConfig,
  type AgentStep,
} from "@hachi/schemas/nodes";

/**
 * Agent Step
 * Autonomous agent that can use tools to accomplish tasks (ReAct pattern)
 */
export const createAgentStep = (config: Partial<AgentNodeConfig> = {}) =>
  createStep({
    id: "agent",
    inputSchema: agentNodeInputSchema,
    outputSchema: agentNodeOutputSchema,
    execute: async ({ context: ctx }) => {
      const { query, context, documents } = ctx;
      const model = config.model || "gpt-4o";
      const systemPrompt = config.systemPrompt;
      const temperature = config.temperature ?? 0.7;
      const maxIterations = config.maxIterations || 5;
      const tools = config.tools || ["web_search", "retrieval"];

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is required for Agent");
      }

      // Build context from documents if provided
      let fullContext = context || "";
      if (documents && documents.length > 0) {
        const docContext = documents
          .map((doc: { content: string }, i: number) => `[Document ${i + 1}]:\n${doc.content}`)
          .join("\n\n");
        fullContext = fullContext ? `${fullContext}\n\n${docContext}` : docContext;
      }

      // Define available tools
      const toolDefinitions = getToolDefinitions(tools);

      // Build system prompt for ReAct pattern
      const reactSystemPrompt = systemPrompt || `You are a helpful AI assistant that can use tools to help answer questions.

Available Tools:
${toolDefinitions.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

${fullContext ? `\nContext:\n${fullContext}` : ""}

Use the following format:

Thought: [Your reasoning about what to do next]
Action: [Tool name to use, or "finish" if done]
Action Input: [Input to the tool as JSON, or final answer if finishing]
Observation: [Result of the action - this will be provided to you]

Continue this pattern until you have enough information to answer the question.
When you have the final answer, use Action: finish.`;

      const steps: AgentStep[] = [];
      const toolsUsed: string[] = [];
      let finalResponse = "";
      let iteration = 0;

      // Agent loop
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: reactSystemPrompt },
        { role: "user", content: query },
      ];

      while (iteration < maxIterations) {
        iteration++;

        // Get agent's next action
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
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
        const agentResponse = choice.message.content;
        messages.push({ role: "assistant", content: agentResponse });

        // Parse the agent's response
        const parsed = parseAgentResponse(agentResponse);

        // Convert actionInput to Record if it's a string
        const actionInputRecord = typeof parsed.actionInput === "string"
          ? { value: parsed.actionInput }
          : parsed.actionInput;

        const step: AgentStep = {
          iteration,
          thought: parsed.thought,
          action: parsed.action,
          actionInput: actionInputRecord,
          timestamp: new Date().toISOString(),
        };

        // Check if agent wants to finish
        if (parsed.action?.toLowerCase() === "finish") {
          finalResponse = typeof parsed.actionInput === "string"
            ? parsed.actionInput
            : JSON.stringify(parsed.actionInput);
          steps.push(step);
          break;
        }

        // Execute tool if specified
        if (parsed.action) {
          const toolResult = await executeTool(
            parsed.action,
            parsed.actionInput
          );

          step.observation = toolResult;
          toolsUsed.push(parsed.action);

          // Add observation to messages
          messages.push({
            role: "user",
            content: `Observation: ${toolResult}`
          });
        }

        steps.push(step);
      }

      // If we hit max iterations without finishing, generate a summary
      if (!finalResponse) {
        finalResponse = "I was unable to complete the task within the allowed iterations. Here's what I found: " +
          steps.map((s) => s.observation).filter(Boolean).join(" ");
      }

      return {
        response: finalResponse,
        steps,
        totalIterations: iteration,
        toolsUsed: [...new Set(toolsUsed)],
        model,
      };
    },
  });

/**
 * Parse agent's ReAct-style response
 */
const parseAgentResponse = (response: string): {
  thought: string;
  action?: string;
  actionInput?: Record<string, unknown> | string;
} => {
  const thoughtMatch = response.match(/Thought:\s*(.+?)(?=\n|Action:|$)/s);
  const actionMatch = response.match(/Action:\s*(.+?)(?=\n|Action Input:|$)/s);
  const actionInputMatch = response.match(/Action Input:\s*(.+?)(?=\n|Observation:|$)/s);

  let actionInput: Record<string, unknown> | string | undefined;
  if (actionInputMatch && actionInputMatch[1]) {
    try {
      actionInput = JSON.parse(actionInputMatch[1].trim());
    } catch {
      actionInput = actionInputMatch[1].trim();
    }
  }

  return {
    thought: thoughtMatch?.[1]?.trim() || "",
    action: actionMatch?.[1]?.trim(),
    actionInput,
  };
};

/**
 * Get tool definitions for available tools
 */
const getToolDefinitions = (tools: string[]) => {
  const allTools = [
    {
      name: "web_search",
      description: "Search the web for current information. Input: { \"query\": \"search query\" }",
    },
    {
      name: "retrieval",
      description: "Search the knowledge base for relevant documents. Input: { \"query\": \"search query\" }",
    },
    {
      name: "code_executor",
      description: "Execute Python code in a sandbox. Input: { \"code\": \"python code\" }",
    },
    {
      name: "http_request",
      description: "Make an HTTP request. Input: { \"url\": \"...\", \"method\": \"GET|POST\", \"body\": {...} }",
    },
  ];

  return allTools.filter((t) => tools.includes(t.name));
};

/**
 * Execute a tool
 */
const executeTool = async (
  toolName: string,
  input: Record<string, unknown> | string | undefined
): Promise<string> => {
  const inputObj = typeof input === "string" ? { query: input } : input || {};

  switch (toolName.toLowerCase()) {
    case "web_search":
      // Placeholder - would integrate with Tavily, Serper, etc.
      return `Web search results for "${inputObj.query}": [Search results would appear here]`;

    case "retrieval":
      // Placeholder - would use the retrieve step
      return `Retrieved documents for "${inputObj.query}": [Retrieved documents would appear here]`;

    case "code_executor":
      // Placeholder - would use sandboxed execution
      return `Code execution not yet implemented`;

    case "http_request":
      try {
        const response = await fetch(inputObj.url as string, {
          method: (inputObj.method as string) || "GET",
          headers: { "Content-Type": "application/json" },
          body: inputObj.body ? JSON.stringify(inputObj.body) : undefined,
        });
        const text = await response.text();
        return text.slice(0, 1000); // Truncate long responses
      } catch (error) {
        return `HTTP request failed: ${error}`;
      }

    default:
      return `Unknown tool: ${toolName}`;
  }
};

// Default export for simple usage
export const agentStep = createAgentStep();
