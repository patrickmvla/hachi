import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import type { HachiNodeDefinition } from "@hachi/node-sdk";
import {
  createQueryStep,
  createEmbedStep,
  createRetrieveStep,
  createGenerateStep,
  createHyDEStep,
  createRerankStep,
  createJudgeStep,
  createAgentStep,
  createEvalFaithfulnessStep,
  createEvalRelevancyStep,
  createEvalContextPrecisionStep,
} from "@hachi/mastra-core/steps";

/**
 * Built-in step factories by node type.
 */
const BUILTIN_FACTORIES: Record<string, (config?: any) => any> = {
  query: createQueryStep,
  embed: createEmbedStep,
  retrieve: createRetrieveStep,
  generate: createGenerateStep,
  hyde: createHyDEStep,
  rerank: createRerankStep,
  judge: createJudgeStep,
  agent: createAgentStep,
  "eval-faithfulness": createEvalFaithfulnessStep,
  "eval-relevancy": createEvalRelevancyStep,
  "eval-context-precision": createEvalContextPrecisionStep,
};

interface NodeRegistryEntry {
  definition: HachiNodeDefinition;
  stepFactory: (config?: any) => any;
}

/**
 * Node Registry
 * Manages built-in and custom node types for the execution engine.
 */
export class NodeRegistry {
  private entries = new Map<string, NodeRegistryEntry>();

  /**
   * Registers all built-in node types.
   */
  registerBuiltins() {
    for (const [type, factory] of Object.entries(BUILTIN_FACTORIES)) {
      this.entries.set(type, {
        definition: {
          type,
          label: type,
          ports: { inputs: [], outputs: [] },
          configSchema: z.record(z.string(), z.unknown()),
          inputSchema: z.record(z.string(), z.unknown()),
          outputSchema: z.record(z.string(), z.unknown()),
          execute: async () => ({}),
        },
        stepFactory: factory,
      });
    }
  }

  /**
   * Registers a custom node definition.
   */
  register(definition: HachiNodeDefinition) {
    const stepFactory = (config?: any) => {
      return createStep({
        id: definition.type,
        inputSchema: definition.inputSchema || z.record(z.string(), z.unknown()),
        outputSchema: definition.outputSchema || z.record(z.string(), z.unknown()),
        execute: async (params: any) => {
          const { inputData } = params;
          return definition.execute({
            input: inputData,
            config: config || {},
          });
        },
      });
    };

    this.entries.set(definition.type, { definition, stepFactory });
  }

  /**
   * Loads custom node definitions from a directory using Bun.Glob.
   */
  async loadFromDirectory(dir: string) {
    try {
      const glob = new Bun.Glob("**/*.{ts,js}");
      for await (const path of glob.scan({ cwd: dir })) {
        try {
          const fullPath = `${dir}/${path}`;
          const mod = await import(fullPath);
          const definition = mod.default || mod.node;
          if (definition?.type && definition?.execute) {
            this.register(definition);
          }
        } catch (err) {
          console.warn(`[NodeRegistry] Failed to load ${path}:`, err);
        }
      }
    } catch {
      // Directory doesn't exist or can't be scanned
    }
  }

  /**
   * Returns all registered node types with metadata.
   */
  getAll(): Array<{
    type: string;
    label: string;
    description?: string;
    category?: string;
    ports: { inputs: any[]; outputs: any[] };
    isBuiltin: boolean;
  }> {
    return Array.from(this.entries.entries()).map(([type, entry]) => ({
      type,
      label: entry.definition.label,
      description: entry.definition.description,
      category: entry.definition.category,
      ports: entry.definition.ports,
      isBuiltin: type in BUILTIN_FACTORIES,
    }));
  }

  /**
   * Gets the step factory for a node type.
   */
  getStepFactory(type: string): ((config?: any) => any) | undefined {
    return this.entries.get(type)?.stepFactory;
  }

  /**
   * Checks if a node type is registered.
   */
  has(type: string): boolean {
    return this.entries.has(type);
  }
}

/**
 * Singleton node registry instance.
 */
export const nodeRegistry = new NodeRegistry();
nodeRegistry.registerBuiltins();
