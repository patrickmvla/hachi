// Mastra steps for RAG nodes
export * from "./query";
export * from "./embed";
export * from "./retrieve";
export * from "./generate";
export * from "./hyde";
export * from "./rerank";
export * from "./judge";
export * from "./agent";

// Re-export step factories for convenience
export {
  createQueryStep,
  queryStep,
} from "./query";

export {
  createEmbedStep,
  embedStep,
} from "./embed";

export {
  createRetrieveStep,
  retrieveStep,
} from "./retrieve";

export {
  createGenerateStep,
  generateStep,
} from "./generate";

export {
  createHyDEStep,
  hydeStep,
} from "./hyde";

export {
  createRerankStep,
  rerankStep,
} from "./rerank";

export {
  createJudgeStep,
  judgeStep,
} from "./judge";

export {
  createAgentStep,
  agentStep,
} from "./agent";

// Step type registry for the compiler
export const STEP_REGISTRY = {
  query: "createQueryStep",
  embed: "createEmbedStep",
  retrieve: "createRetrieveStep",
  generate: "createGenerateStep",
  hyde: "createHyDEStep",
  rerank: "createRerankStep",
  judge: "createJudgeStep",
  agent: "createAgentStep",
} as const;

export type StepType = keyof typeof STEP_REGISTRY;
