import type { NodeType } from "./index";
import { PortType, NODE_PORTS } from "./ports";

/**
 * Which output port types can connect to which input port types.
 * This is the single source of truth for connection compatibility.
 */
export const PORT_COMPATIBILITY: Record<PortType, PortType[]> = {
  [PortType.Query]:            [PortType.Query, PortType.Text],
  [PortType.Text]:             [PortType.Text, PortType.Query],
  [PortType.Embedding]:        [PortType.Embedding],
  [PortType.Documents]:        [PortType.Documents],
  [PortType.Response]:         [PortType.Query, PortType.Text],
  [PortType.Judgments]:        [PortType.Query, PortType.Documents],
  [PortType.HypotheticalDocs]: [PortType.Documents, PortType.Text],
  [PortType.EvalScore]:        [], // terminal — eval scores don't connect downstream
};

/**
 * Derives valid node-to-node connections from port type declarations.
 * Returns a record of source node type → allowed target node types.
 */
export function getValidConnections(): Record<NodeType, NodeType[]> {
  const nodeTypes = Object.keys(NODE_PORTS) as NodeType[];
  const result: Record<string, NodeType[]> = {};

  for (const sourceType of nodeTypes) {
    const sourceOutputs = NODE_PORTS[sourceType].outputs;
    const targets: Set<NodeType> = new Set();

    for (const targetType of nodeTypes) {
      if (targetType === sourceType && targetType !== "agent") continue; // no self-loops (except agent can chain)
      const targetInputs = NODE_PORTS[targetType].inputs;
      if (targetInputs.length === 0) continue; // can't connect to nodes with no inputs

      // Check if any source output is compatible with any target input
      for (const outputPort of sourceOutputs) {
        const compatibleInputs = PORT_COMPATIBILITY[outputPort] ?? [];
        for (const inputPort of targetInputs) {
          if (compatibleInputs.includes(inputPort)) {
            targets.add(targetType);
          }
        }
      }
    }

    result[sourceType] = Array.from(targets);
  }

  return result as Record<NodeType, NodeType[]>;
}

/**
 * Pre-computed valid connections for fast lookup.
 */
export const VALID_CONNECTIONS: Record<NodeType, NodeType[]> = getValidConnections();

/**
 * Required upstream node types for validation warnings.
 */
export const REQUIRED_INPUTS: Partial<Record<NodeType, NodeType[]>> = {
  retrieve: ["embed"],
  rerank: ["retrieve"],
  judge: ["retrieve"],
  generate: [],
  "eval-faithfulness": ["generate"],
  "eval-relevancy": ["generate"],
  "eval-context-precision": ["retrieve"],
};

/**
 * Check if a specific node-to-node connection is valid.
 */
export function isValidNodeConnection(sourceType: NodeType, targetType: NodeType): boolean {
  const allowed = VALID_CONNECTIONS[sourceType];
  return allowed ? allowed.includes(targetType) : false;
}
