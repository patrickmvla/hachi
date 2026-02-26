import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

export type NodeStatus = "initial" | "loading" | "success" | "error";

export type PlaygroundNode = Node<{
  label: string;
  type: string;
  config?: Record<string, unknown>;
  status?: NodeStatus;
  statusMessage?: string;
}>;

export type PlaygroundEdge = Edge<{
  animated?: boolean;
}>;

export interface LogEntry {
  id: string;
  nodeId: string;
  nodeType: string;
  stepName: string;
  status: NodeStatus;
  startedAt: number;
  completedAt?: number;
  latencyMs?: number;
  output?: Record<string, unknown>;
  logMessages?: string[];
}

interface PlaygroundState {
  // Graph
  nodes: PlaygroundNode[];
  edges: PlaygroundEdge[];
  selectedNodeId: string | null;

  // UI
  showTemplatePicker: boolean;
  showPropertyPanel: boolean;

  // Execution
  isRunning: boolean;
  testQuery: string;
  logEntries: LogEntry[];
  currentNodeId: string | null;
  selectedLogEntryId: string | null;

  // Graph actions
  onNodesChange: OnNodesChange<PlaygroundNode>;
  onEdgesChange: OnEdgesChange<PlaygroundEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: PlaygroundNode[]) => void;
  setEdges: (edges: PlaygroundEdge[]) => void;
  addNode: (node: PlaygroundNode) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<PlaygroundNode["data"]>) => void;

  // Selection
  setSelectedNodeId: (id: string | null) => void;

  // UI actions
  setShowTemplatePicker: (show: boolean) => void;
  setShowPropertyPanel: (show: boolean) => void;

  // Execution actions
  setIsRunning: (running: boolean) => void;
  setTestQuery: (query: string) => void;
  setCurrentNodeId: (id: string | null) => void;
  setSelectedLogEntryId: (id: string | null) => void;

  // Status
  setNodeStatus: (nodeId: string, status: NodeStatus, message?: string) => void;
  clearAllNodeStatuses: () => void;
  setEdgeAnimated: (edgeId: string, animated: boolean) => void;
  clearAllEdgeAnimations: () => void;

  // Log
  addLogEntry: (entry: LogEntry) => void;
  updateLogEntry: (id: string, updates: Partial<LogEntry>) => void;
  clearLog: () => void;

  // Graph analysis
  getExecutionOrder: () => PlaygroundNode[];
  hasCycle: () => boolean;

  // Reset
  reset: () => void;
}

const initialState = {
  nodes: [] as PlaygroundNode[],
  edges: [] as PlaygroundEdge[],
  selectedNodeId: null as string | null,
  showTemplatePicker: false,
  showPropertyPanel: true,
  isRunning: false,
  testQuery: "",
  logEntries: [] as LogEntry[],
  currentNodeId: null as string | null,
  selectedLogEntryId: null as string | null,
};

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  ...initialState,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges, selectedNodeId } = get();
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setShowTemplatePicker: (show) => set({ showTemplatePicker: show }),
  setShowPropertyPanel: (show) => set({ showPropertyPanel: show }),

  setIsRunning: (running) => set({ isRunning: running }),
  setTestQuery: (query) => set({ testQuery: query }),
  setCurrentNodeId: (id) => set({ currentNodeId: id }),
  setSelectedLogEntryId: (id) => set({ selectedLogEntryId: id }),

  setNodeStatus: (nodeId, status, message) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status, statusMessage: message } }
          : node
      ),
    });
  },

  clearAllNodeStatuses: () => {
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "initial" as NodeStatus, statusMessage: undefined },
      })),
    });
  },

  setEdgeAnimated: (edgeId, animated) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, animated, data: { ...edge.data, animated } }
          : edge
      ),
    });
  },

  clearAllEdgeAnimations: () => {
    set({
      edges: get().edges.map((edge) => ({
        ...edge,
        animated: false,
        data: { ...edge.data, animated: false },
      })),
    });
  },

  addLogEntry: (entry) => {
    set({ logEntries: [...get().logEntries, entry] });
  },

  updateLogEntry: (id, updates) => {
    set({
      logEntries: get().logEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    });
  },

  clearLog: () => set({ logEntries: [], selectedLogEntryId: null }),

  getExecutionOrder: () => {
    const { nodes, edges } = get();
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    }

    for (const edge of edges) {
      const neighbors = adjList.get(edge.source);
      if (neighbors) {
        neighbors.push(edge.target);
      }
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    const result: PlaygroundNode[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodes.find((n) => n.id === nodeId);
      if (node) result.push(node);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result;
  },

  hasCycle: () => {
    const { nodes } = get();
    return get().getExecutionOrder().length !== nodes.length;
  },

  reset: () => set({ ...initialState }),
}));
