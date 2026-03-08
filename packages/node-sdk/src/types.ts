import { z } from "zod";

/**
 * Port types for node connections.
 */
export type PortType = "string" | "vector" | "document" | "json";

export interface PortDefinition {
  name: string;
  type: PortType;
  required?: boolean;
}

/**
 * Configuration for a custom node definition.
 */
export interface HachiNodeDefinition<
  TConfig extends z.ZodTypeAny = z.ZodTypeAny,
  TInput extends z.ZodTypeAny = z.ZodTypeAny,
  TOutput extends z.ZodTypeAny = z.ZodTypeAny,
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
