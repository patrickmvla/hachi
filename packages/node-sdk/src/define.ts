import { z } from "zod";
import type { HachiNodeDefinition, PortDefinition } from "./types";

interface DefineNodeOptions<
  TConfig extends z.ZodTypeAny,
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> {
  type: string;
  label: string;
  description?: string;
  category?: string;
  ports: {
    inputs: PortDefinition[];
    outputs: PortDefinition[];
  };
  configSchema: TConfig;
  inputSchema: TInput;
  outputSchema: TOutput;
  execute: (params: {
    input: z.infer<TInput>;
    config: z.infer<TConfig>;
  }) => Promise<z.infer<TOutput>>;
}

/**
 * Defines a custom Hachi node.
 * Returns a node definition that can be registered with the node registry.
 */
export function defineNode<
  TConfig extends z.ZodTypeAny,
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
>(options: DefineNodeOptions<TConfig, TInput, TOutput>): HachiNodeDefinition<TConfig, TInput, TOutput> {
  return {
    type: options.type,
    label: options.label,
    description: options.description,
    category: options.category,
    ports: options.ports,
    configSchema: options.configSchema,
    inputSchema: options.inputSchema,
    outputSchema: options.outputSchema,
    execute: options.execute,
  };
}
