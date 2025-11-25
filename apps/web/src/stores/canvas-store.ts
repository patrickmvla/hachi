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

export type HachiNode = Node<{
  label: string;
  type: string;
  config?: Record<string, unknown>;
}>;

export type HachiEdge = Edge<{
  dataType?: "string" | "vector" | "document" | "json";
}>;

interface CanvasState {
  nodes: HachiNode[];
  edges: HachiEdge[];
  selectedNodeId: string | null;
  isRunning: boolean;
  runId: string | null;

  // Actions
  onNodesChange: OnNodesChange<HachiNode>;
  onEdgesChange: OnEdgesChange<HachiEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: HachiNode[]) => void;
  setEdges: (edges: HachiEdge[]) => void;
  addNode: (node: HachiNode) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setRunId: (runId: string | null) => void;
  reset: () => void;
}

const initialNodes: HachiNode[] = [];
const initialEdges: HachiEdge[] = [];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  isRunning: false,
  runId: null,

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

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setIsRunning: (isRunning) => set({ isRunning }),

  setRunId: (runId) => set({ runId }),

  reset: () => set({ nodes: initialNodes, edges: initialEdges, selectedNodeId: null }),
}));
